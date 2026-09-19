package com.vedikfarm.api.cart.dto;

import java.math.BigDecimal;
import java.util.List;

public class CartResponse {
    public List<Item> items;
    public BigDecimal subtotal;

    public static class Item {
        public Long cartItemId;
        public Long productId;
        public String name;
        public String slug;
        public String imageUrl;
        public String unitLabel;
        public BigDecimal unitPrice;
        public int quantity;
        public int availableStock;
        public BigDecimal lineTotal;
    }
}
