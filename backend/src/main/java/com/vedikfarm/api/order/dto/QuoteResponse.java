package com.vedikfarm.api.order.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * A side-effect-free preview of what an order would cost for the current cart + a shipping
 * address - no Order row, no Razorpay order, nothing persisted. Lets the checkout page show
 * the real GST + shipping + total *before* the customer commits to "Pay Now", instead of only
 * finding out the final amount once the Razorpay popup opens.
 */
public class QuoteResponse {
    public BigDecimal subtotal;
    public BigDecimal cgstAmount;
    public BigDecimal sgstAmount;
    public BigDecimal igstAmount;
    public BigDecimal shippingFee;
    public BigDecimal total;
    public List<Item> items;

    public static class Item {
        public String productName;
        public String unitLabel;
        public int quantity;
        public BigDecimal lineSubtotal;
        public BigDecimal lineGst;
        public BigDecimal lineTotal;
    }
}
