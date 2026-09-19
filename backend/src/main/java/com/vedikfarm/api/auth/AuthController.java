package com.vedikfarm.api.auth;

import com.vedikfarm.api.auth.dto.AuthResponse;
import com.vedikfarm.api.auth.dto.LoginRequest;
import com.vedikfarm.api.auth.dto.RegisterRequest;
import com.vedikfarm.api.common.ApiException;
import com.vedikfarm.api.common.ApiResponse;
import com.vedikfarm.api.user.User;
import com.vedikfarm.api.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ApiResponse<Map<String, Object>> me(@AuthenticationPrincipal AuthenticatedUser principal) {
        User user = userRepository.findById(principal.getUserId())
                .orElseThrow(() -> ApiException.notFound("User not found"));
        return ApiResponse.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "name", user.getName(),
                "phone", user.getPhone() == null ? "" : user.getPhone(),
                "role", user.getRole().name()
        ));
    }
}
