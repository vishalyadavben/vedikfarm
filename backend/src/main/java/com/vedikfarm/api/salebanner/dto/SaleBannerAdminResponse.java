package com.vedikfarm.api.salebanner.dto;

import com.vedikfarm.api.salebanner.SaleBanner;

import java.time.LocalDateTime;

public record SaleBannerAdminResponse(String label, String linkUrl, LocalDateTime startAt, LocalDateTime endAt,
                                      boolean enabled, boolean liveNow) {
    public static SaleBannerAdminResponse from(SaleBanner b, boolean liveNow) {
        return new SaleBannerAdminResponse(b.getLabel(), b.getLinkUrl(), b.getStartAt(), b.getEndAt(), b.isEnabled(), liveNow);
    }
}
