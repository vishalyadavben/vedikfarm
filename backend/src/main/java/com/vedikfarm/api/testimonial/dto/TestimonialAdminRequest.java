package com.vedikfarm.api.testimonial.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class TestimonialAdminRequest {
    @NotBlank @Size(max = 1000) private String quote;
    @NotBlank @Size(max = 150) private String customerName;
    @Size(max = 100) private String city;
    @Min(1) @Max(5) private int rating = 5;
    private int sortOrder;
    private boolean active = true;

    public String getQuote() { return quote; }
    public void setQuote(String quote) { this.quote = quote; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
