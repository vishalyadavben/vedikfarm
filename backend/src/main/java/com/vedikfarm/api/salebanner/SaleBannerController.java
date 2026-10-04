package com.vedikfarm.api.salebanner;

import com.vedikfarm.api.common.ApiResponse;
import com.vedikfarm.api.salebanner.dto.SaleBannerPublicResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.LocalDateTime;

/** Public: tells the storefront whether to show the countdown strip right now. */
@RestController
public class SaleBannerController {

    private final SaleBannerService service;

    public SaleBannerController(SaleBannerService service) {
        this.service = service;
    }

    @GetMapping("/api/sale-banner")
    public ApiResponse<SaleBannerPublicResponse> current() {
        SaleBanner b = service.get();
        LocalDateTime now = service.nowIst();
        if (!service.isLive(b, now)) {
            return ApiResponse.ok(SaleBannerPublicResponse.notLive());
        }
        String link = b.getLinkUrl() == null || b.getLinkUrl().isBlank() ? null : b.getLinkUrl().trim();
        long endsAt = b.getEndAt().atZone(SaleBannerService.IST).toInstant().toEpochMilli();
        return ApiResponse.ok(new SaleBannerPublicResponse(true, b.getLabel(), link, endsAt, Instant.now().toEpochMilli()));
    }
}
