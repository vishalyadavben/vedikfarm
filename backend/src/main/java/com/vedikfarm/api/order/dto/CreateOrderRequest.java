package com.vedikfarm.api.order.dto;

import jakarta.validation.constraints.NotNull;

public class CreateOrderRequest {
    @NotNull
    private Long addressId;

    /** Optional - only set for buyers who want a GST tax invoice with their GSTIN on it. */
    private String buyerGstin;

    public Long getAddressId() { return addressId; }
    public void setAddressId(Long addressId) { this.addressId = addressId; }
    public String getBuyerGstin() { return buyerGstin; }
    public void setBuyerGstin(String buyerGstin) { this.buyerGstin = buyerGstin; }
}
