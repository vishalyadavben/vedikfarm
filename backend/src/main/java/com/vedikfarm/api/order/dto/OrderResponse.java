package com.vedikfarm.api.order.dto;

import com.vedikfarm.api.order.Order;
import com.vedikfarm.api.order.OrderItem;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {
    public Long id;
    public String orderNumber;
    public String status;
    public BigDecimal subtotal;
    public BigDecimal cgstAmount;
    public BigDecimal sgstAmount;
    public BigDecimal igstAmount;
    public BigDecimal shippingFee;
    public BigDecimal total;
    public String buyerGstin;
    public String shipName, shipPhone, shipLine1, shipLine2, shipCity, shipState, shipPincode;
    public LocalDateTime createdAt;
    public List<Item> items;

    // Only populated right after order creation, so the frontend can open Razorpay Checkout.
    public String razorpayOrderId;
    public String razorpayKeyId;

    public static class Item {
        public String productName;
        public String unitLabel;
        public BigDecimal unitPrice;
        public int quantity;
        public BigDecimal lineTotal;
    }

    public static OrderResponse from(Order o, List<OrderItem> items) {
        OrderResponse r = new OrderResponse();
        r.id = o.getId();
        r.orderNumber = o.getOrderNumber();
        r.status = o.getStatus().name();
        r.subtotal = o.getSubtotal();
        r.cgstAmount = o.getCgstAmount();
        r.sgstAmount = o.getSgstAmount();
        r.igstAmount = o.getIgstAmount();
        r.shippingFee = o.getShippingFee();
        r.total = o.getTotal();
        r.buyerGstin = o.getBuyerGstin();
        r.shipName = o.getShipName();
        r.shipPhone = o.getShipPhone();
        r.shipLine1 = o.getShipLine1();
        r.shipLine2 = o.getShipLine2();
        r.shipCity = o.getShipCity();
        r.shipState = o.getShipState();
        r.shipPincode = o.getShipPincode();
        r.createdAt = o.getCreatedAt();
        r.items = items.stream().map(oi -> {
            Item i = new Item();
            i.productName = oi.getProductName();
            i.unitLabel = oi.getUnitLabel();
            i.unitPrice = oi.getUnitPrice();
            i.quantity = oi.getQuantity();
            i.lineTotal = oi.getLineTotal();
            return i;
        }).toList();
        return r;
    }
}
