package com.vedikfarm.api.cart.dto;

import jakarta.validation.constraints.Min;

public class UpdateCartItemRequest {
    @Min(0) // 0 means "remove this item"
    private int quantity;

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}
