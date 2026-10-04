package com.vedikfarm.api.auth;

import com.vedikfarm.api.auth.dto.ChangePasswordRequest;
import com.vedikfarm.api.common.ApiException;
import com.vedikfarm.api.common.ApiResponse;
import com.vedikfarm.api.user.User;
import com.vedikfarm.api.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

/**
 * Lives under /api/account (not /api/auth) on purpose: /api/auth/** is public in SecurityConfig, whereas
 * everything else - including this - requires a valid login.
 */
@RestController
@RequestMapping("/api/account")
public class AccountController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AccountController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PutMapping("/password")
    public ApiResponse<Void> changePassword(@AuthenticationPrincipal AuthenticatedUser principal,
                                             @Valid @RequestBody ChangePasswordRequest req) {
        User user = userRepository.findById(principal.getUserId())
                .orElseThrow(() -> ApiException.notFound("User not found"));
        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPasswordHash())) {
            throw ApiException.badRequest("Your current password is incorrect.");
        }
        if (passwordEncoder.matches(req.getNewPassword(), user.getPasswordHash())) {
            throw ApiException.badRequest("Your new password must be different from the current one.");
        }
        user.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
        return ApiResponse.ok("Password updated.", null);
    }
}
