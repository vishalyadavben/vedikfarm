package com.vedikfarm.api.admin.dto;

import jakarta.validation.constraints.Min;

public class UpdateStockRequest {
    @Min(0)
    private int stockQty;

    public int getStockQty() { return stockQty; }
    public void setStockQty(int stockQty) { this.stockQty = stockQty; }
}
