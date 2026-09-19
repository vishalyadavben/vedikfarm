package com.vedikfarm.api.catalog.dto;

import com.vedikfarm.api.catalog.Category;

public class CategoryResponse {
    public Long id;
    public String name;
    public String slug;

    public static CategoryResponse from(Category c) {
        CategoryResponse r = new CategoryResponse();
        r.id = c.getId();
        r.name = c.getName();
        r.slug = c.getSlug();
        return r;
    }
}
