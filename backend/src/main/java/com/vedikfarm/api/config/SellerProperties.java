package com.vedikfarm.api.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.seller")
public class SellerProperties {
    /** State the business ships from - used to decide CGST+SGST (same state) vs IGST (different state). */
    private String state = "Maharashtra";

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
}
