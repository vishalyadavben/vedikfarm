package com.vedikfarm.api.admin.dto;

import jakarta.validation.constraints.NotBlank;

public class HealthConcernAdminRequest {
    @NotBlank private String name;
    private int sortOrder;
    private boolean active = true;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
