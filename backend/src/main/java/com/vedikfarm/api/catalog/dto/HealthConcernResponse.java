package com.vedikfarm.api.catalog.dto;

import com.vedikfarm.api.catalog.HealthConcern;

public class HealthConcernResponse {
    public Long id;
    public String name;
    public String slug;
    public String imageUrl;
    public int sortOrder;
    public boolean active;

    public static HealthConcernResponse from(HealthConcern c) {
        HealthConcernResponse r = new HealthConcernResponse();
        r.id = c.getId();
        r.name = c.getName();
        r.slug = c.getSlug();
        r.imageUrl = c.getImageUrl();
        r.sortOrder = c.getSortOrder();
        r.active = c.isActive();
        return r;
    }
}
