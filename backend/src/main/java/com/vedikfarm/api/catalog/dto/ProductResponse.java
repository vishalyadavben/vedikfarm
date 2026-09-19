package com.vedikfarm.api.catalog.dto;

import com.vedikfarm.api.catalog.Product;

import java.math.BigDecimal;

public class ProductResponse {
    public Long id;
    public Long categoryId;
    public String name;
    public String slug;
    public String description;
    public BigDecimal price;
    public String unitLabel;
    public int stockQty;
    public String imageUrl;
    public BigDecimal gstRate;
    public boolean active;

    public static ProductResponse from(Product p) {
        ProductResponse r = new ProductResponse();
        r.id = p.getId();
        r.categoryId = p.getCategoryId();
        r.name = p.getName();
        r.slug = p.getSlug();
        r.description = p.getDescription();
        r.price = p.getPrice();
        r.unitLabel = p.getUnitLabel();
        r.stockQty = p.getStockQty();
        r.imageUrl = p.getImageUrl();
        r.gstRate = p.getGstRate();
        r.active = p.isActive();
        return r;
    }
}
