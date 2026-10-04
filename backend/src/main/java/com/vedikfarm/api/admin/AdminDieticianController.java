package com.vedikfarm.api.admin;

import com.vedikfarm.api.common.ApiException;
import com.vedikfarm.api.common.ApiResponse;
import com.vedikfarm.api.dietician.DieticianRequest;
import com.vedikfarm.api.dietician.DieticianRequestRepository;
import com.vedikfarm.api.dietician.dto.DieticianRequestResponse;
import com.vedikfarm.api.user.User;
import com.vedikfarm.api.user.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

/** Everything here is behind ROLE_ADMIN - see SecurityConfig ("/api/admin/**" -> hasRole("ADMIN")). */
@RestController
@RequestMapping("/api/admin/dietician-requests")
public class AdminDieticianController {

    private static final Set<String> STATUSES = Set.of("NEW", "CONTACTED", "COMPLETED");

    private final DieticianRequestRepository repository;
    private final UserRepository userRepository;

    public AdminDieticianController(DieticianRequestRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    public static class UpdateStatusRequest {
        public String status;
    }

    @GetMapping
    public ApiResponse<List<DieticianRequestResponse>> list() {
        List<DieticianRequest> requests = repository.findAllByOrderByUpdatedAtDesc();
        Map<Long, User> users = userRepository.findAllById(
                        requests.stream().map(DieticianRequest::getUserId).toList())
                .stream().collect(Collectors.toMap(User::getId, Function.identity()));
        return ApiResponse.ok(requests.stream().map(r -> {
            DieticianRequestResponse d = DieticianRequestResponse.from(r);
            User u = users.get(r.getUserId());
            if (u != null) {
                d.email = u.getEmail();
                if (d.phone == null || d.phone.isBlank()) d.phone = u.getPhone();
            }
            return d;
        }).toList());
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<DieticianRequestResponse> updateStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest req) {
        if (req.status == null || !STATUSES.contains(req.status)) {
            throw ApiException.badRequest("Status must be one of NEW, CONTACTED, COMPLETED");
        }
        DieticianRequest r = repository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Request not found"));
        r.setStatus(req.status);
        r.setUpdatedAt(LocalDateTime.now());
        return ApiResponse.ok(DieticianRequestResponse.from(repository.save(r)));
    }
}
