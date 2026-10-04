package com.vedikfarm.api.dietician;

import com.vedikfarm.api.auth.AuthenticatedUser;
import com.vedikfarm.api.common.ApiResponse;
import com.vedikfarm.api.dietician.dto.DieticianRequestBody;
import com.vedikfarm.api.dietician.dto.DieticianRequestResponse;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;

/** "My Dietician Plan" - needs a login (falls under anyRequest().authenticated() in SecurityConfig). */
@RestController
@RequestMapping("/api/dietician-plan")
public class DieticianPlanController {

    private final DieticianRequestRepository repository;

    public DieticianPlanController(DieticianRequestRepository repository) {
        this.repository = repository;
    }

    /** The logged-in user's submitted details, or null data if they haven't submitted yet. */
    @GetMapping
    public ApiResponse<DieticianRequestResponse> mine(@AuthenticationPrincipal AuthenticatedUser user) {
        return ApiResponse.ok(repository.findByUserId(user.getUserId()).map(DieticianRequestResponse::from).orElse(null));
    }

    /** Create or update (one request per customer). An update puts the request back to NEW for the team. */
    @PutMapping
    public ApiResponse<DieticianRequestResponse> submit(@AuthenticationPrincipal AuthenticatedUser user,
                                                         @Valid @RequestBody DieticianRequestBody req) {
        DieticianRequest r = repository.findByUserId(user.getUserId()).orElseGet(() -> {
            DieticianRequest created = new DieticianRequest();
            created.setUserId(user.getUserId());
            return created;
        });
        r.setName(req.getName().trim());
        r.setDateOfBirth(req.getDateOfBirth());
        r.setAge(Period.between(req.getDateOfBirth(), LocalDate.now()).getYears());
        r.setHeightCm(req.getHeightCm());
        r.setPhone(req.getPhone().trim());
        String disease = req.getDisease() == null ? "" : req.getDisease().trim();
        r.setDisease(disease.isEmpty() ? null : disease);
        r.setStatus("NEW");
        r.setUpdatedAt(LocalDateTime.now());
        return ApiResponse.ok("Thanks! Our dietician will get in touch with you soon.",
                DieticianRequestResponse.from(repository.save(r)));
    }
}
