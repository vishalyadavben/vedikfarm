package com.vedikfarm.api.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.cors")
public class AppProperties {
    /** Comma-separated list of allowed origins for CORS, e.g. https://vedikfarm.in,http://localhost:5173 */
    private String allowedOrigins = "http://localhost:5173";

    public String getAllowedOrigins() { return allowedOrigins; }
    public void setAllowedOrigins(String allowedOrigins) { this.allowedOrigins = allowedOrigins; }
}
