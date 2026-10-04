package com.vedikfarm.api.salebanner.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class SaleBannerAdminRequest {
    @NotBlank @Size(max = 150) private String label;
    @Size(max = 300) private String linkUrl;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private boolean enabled;

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    public String getLinkUrl() { return linkUrl; }
    public void setLinkUrl(String linkUrl) { this.linkUrl = linkUrl; }
    public LocalDateTime getStartAt() { return startAt; }
    public void setStartAt(LocalDateTime startAt) { this.startAt = startAt; }
    public LocalDateTime getEndAt() { return endAt; }
    public void setEndAt(LocalDateTime endAt) { this.endAt = endAt; }
    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
}
