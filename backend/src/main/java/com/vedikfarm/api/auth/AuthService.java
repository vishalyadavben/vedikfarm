package com.vedikfarm.api.auth;

import com.vedikfarm.api.auth.dto.AuthResponse;
import com.vedikfarm.api.auth.dto.LoginRequest;
import com.vedikfarm.api.auth.dto.RegisterRequest;
import com.vedikfarm.api.common.ApiException;
import com.vedikfarm.api.user.Role;
import com.vedikfarm.api.user.User;
import com.vedikfarm.api.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw ApiException.conflict("An account with this email already exists.");
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName().trim());
        user.setPhone(request.getPhone());
        user.setRole(Role.CUSTOMER);
        user = userRepository.save(user);

        return issueToken(user);
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> ApiException.unauthorized("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw ApiException.unauthorized("Invalid email or password.");
        }

        return issueToken(user);
    }

    private AuthResponse issueToken(User user) {
        String token = jwtUtil.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getName(), user.getRole().name());
    }
}
