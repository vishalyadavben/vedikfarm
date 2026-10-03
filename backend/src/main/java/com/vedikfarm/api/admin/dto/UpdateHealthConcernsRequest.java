package com.vedikfarm.api.admin.dto;

import java.util.List;

/** Body for PUT /api/admin/products/{id}/health-concerns - the full set of concern ids a product should be tagged with. */
public class UpdateHealthConcernsRequest {
    private List<Long> healthConcernIds = List.of();

    public List<Long> getHealthConcernIds() { return healthConcernIds; }
    public void setHealthConcernIds(List<Long> healthConcernIds) { this.healthConcernIds = healthConcernIds; }
}
