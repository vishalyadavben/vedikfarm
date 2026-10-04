package com.vedikfarm.api.salebanner;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
public class SaleBannerService {

    /** All sale times are entered and compared in Indian Standard Time. */
    public static final ZoneId IST = ZoneId.of("Asia/Kolkata");

    private final SaleBannerRepository repository;

    public SaleBannerService(SaleBannerRepository repository) {
        this.repository = repository;
    }

    /** The single settings row (created on first use if the seed row is somehow missing). */
    public SaleBanner get() {
        return repository.findById(SaleBanner.ROW_ID).orElseGet(() -> {
            SaleBanner b = new SaleBanner();
            b.setLabel("Festive Sale Ends in");
            return repository.save(b);
        });
    }

    /** Live = switched on AND now is after the start (if set) AND before the end. */
    public boolean isLive(SaleBanner b, LocalDateTime now) {
        if (!b.isEnabled() || b.getEndAt() == null) return false;
        if (b.getStartAt() != null && now.isBefore(b.getStartAt())) return false;
        return now.isBefore(b.getEndAt());
    }

    public LocalDateTime nowIst() {
        return LocalDateTime.now(IST);
    }
}
