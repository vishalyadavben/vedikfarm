package com.vedikfarm.api.salebanner.dto;

/**
 * What the storefront needs. When {@code live} is false everything else is null/0 and the strip is not shown.
 * Epoch milliseconds are used so the browser doesn't have to guess a timezone; serverNowMillis lets it
 * correct for a wrong clock on the visitor's device.
 */
public record SaleBannerPublicResponse(boolean live, String label, String linkUrl, Long endsAtMillis, Long serverNowMillis) {
    public static SaleBannerPublicResponse notLive() {
        return new SaleBannerPublicResponse(false, null, null, null, null);
    }
}
