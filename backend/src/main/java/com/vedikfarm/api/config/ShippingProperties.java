package com.vedikfarm.api.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.math.BigDecimal;

@ConfigurationProperties(prefix = "app.shipping")
public class ShippingProperties {
    /** Orders with subtotal >= this get free shipping. Matches the Rs.999 threshold on the current site. */
    private BigDecimal freeAboveSubtotal = new BigDecimal("999.00");

    /** Flat shipping fee below the threshold. PLACEHOLDER - the current site never states this figure
     *  anywhere public; confirm the real number with the business before launch. */
    private BigDecimal flatFee = new BigDecimal("49.00");

    public BigDecimal getFreeAboveSubtotal() { return freeAboveSubtotal; }
    public void setFreeAboveSubtotal(BigDecimal freeAboveSubtotal) { this.freeAboveSubtotal = freeAboveSubtotal; }

    public BigDecimal getFlatFee() { return flatFee; }
    public void setFlatFee(BigDecimal flatFee) { this.flatFee = flatFee; }
}
