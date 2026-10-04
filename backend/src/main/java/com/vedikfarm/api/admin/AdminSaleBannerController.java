package com.vedikfarm.api.admin;

import com.vedikfarm.api.common.ApiException;
import com.vedikfarm.api.common.ApiResponse;
import com.vedikfarm.api.salebanner.SaleBanner;
import com.vedikfarm.api.salebanner.SaleBannerRepository;
import com.vedikfarm.api.salebanner.SaleBannerService;
import com.vedikfarm.api.salebanner.dto.SaleBannerAdminRequest;
import com.vedikfarm.api.salebanner.dto.SaleBannerAdminResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

/** Everything here is behind ROLE_ADMIN - see SecurityConfig ("/api/admin/**" -> hasRole("ADMIN")). */
@RestController
@RequestMapping("/api/admin/sale-banner")
public class AdminSaleBannerController {

    private final SaleBannerService service;
    private final SaleBannerRepository repository;

    public AdminSaleBannerController(SaleBannerService service, SaleBannerRepository repository) {
        this.service = service;
        this.repository = repository;
    }

    @GetMapping
    public ApiResponse<SaleBannerAdminResponse> get() {
        SaleBanner b = service.get();
        return ApiResponse.ok(SaleBannerAdminResponse.from(b, service.isLive(b, service.nowIst())));
    }

    @PutMapping
    public ApiResponse<SaleBannerAdminResponse> update(@Valid @RequestBody SaleBannerAdminRequest req) {
        if (req.getEndAt() == null) {
            if (req.isEnabled()) throw ApiException.badRequest("Set an end date and time before turning the sale on.");
        } else if (req.getStartAt() != null && !req.getEndAt().isAfter(req.getStartAt())) {
            throw ApiException.badRequest("The end time must be after the start time.");
        }
        String link = req.getLinkUrl() == null ? "" : req.getLinkUrl().trim();
        if (!link.isEmpty() && !link.startsWith("/") && !link.startsWith("https://") && !link.startsWith("http://")) {
            throw ApiException.badRequest("The link must start with / (a page on this site) or https://");
        }

        SaleBanner b = service.get();
        b.setLabel(req.getLabel().trim());
        b.setLinkUrl(link.isEmpty() ? null : link);
        b.setStartAt(req.getStartAt());
        b.setEndAt(req.getEndAt());
        b.setEnabled(req.isEnabled());
        b.setUpdatedAt(LocalDateTime.now());
        repository.save(b);
        return ApiResponse.ok(SaleBannerAdminResponse.from(b, service.isLive(b, service.nowIst())));
    }
}
