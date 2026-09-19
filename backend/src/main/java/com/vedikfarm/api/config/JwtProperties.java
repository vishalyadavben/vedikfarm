package com.vedikfarm.api.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {
    private String secret;
    private long accessTokenExpiryMinutes = 60;
    private long refreshTokenExpiryDays = 30;

    public String getSecret() { return secret; }
    public void setSecret(String secret) { this.secret = secret; }

    public long getAccessTokenExpiryMinutes() { return accessTokenExpiryMinutes; }
    public void setAccessTokenExpiryMinutes(long accessTokenExpiryMinutes) { this.accessTokenExpiryMinutes = accessTokenExpiryMinutes; }

    public long getRefreshTokenExpiryDays() { return refreshTokenExpiryDays; }
    public void setRefreshTokenExpiryDays(long refreshTokenExpiryDays) { this.refreshTokenExpiryDays = refreshTokenExpiryDays; }
}
