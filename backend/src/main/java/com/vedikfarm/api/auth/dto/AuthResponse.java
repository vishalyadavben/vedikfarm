package com.vedikfarm.api.auth.dto;

public class AuthResponse {
    private String accessToken;
    private Long userId;
    private String email;
    private String name;
    private String role;

    public AuthResponse(String accessToken, Long userId, String email, String name, String role) {
        this.accessToken = accessToken;
        this.userId = userId;
        this.email = email;
        this.name = name;
        this.role = role;
    }

    public String getAccessToken() { return accessToken; }
    public Long getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getName() { return name; }
    public String getRole() { return role; }
}
