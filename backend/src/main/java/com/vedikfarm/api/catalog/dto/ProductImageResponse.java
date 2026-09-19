package com.vedikfarm.api.catalog.dto;

import com.vedikfarm.api.catalog.ProductImage;

public class ProductImageResponse {
    public Long id;
    public String imageUrl;

    public static ProductImageResponse from(ProductImage img) {
        ProductImageResponse r = new ProductImageResponse();
        r.id = img.getId();
        r.imageUrl = img.getImageUrl();
        return r;
    }
}
