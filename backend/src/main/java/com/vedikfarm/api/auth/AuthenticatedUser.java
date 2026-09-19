package com.vedikfarm.api.auth;

/** What we attach as the Authentication principal - just enough to authorize + know who's asking. */
public class AuthenticatedUser {
    private final Long userId;
    private final String email;
    private final String role;

    public AuthenticatedUser(Long userId, String email, String role) {
        this.userId = userId;
        this.email = email;
        this.role = role;
    }

    public Long getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
}
