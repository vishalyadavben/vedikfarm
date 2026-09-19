package com.vedikfarm.api.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public class AddressRequest {
    private String label;
    @NotBlank private String recipientName;
    @NotBlank private String line1;
    private String line2;
    @NotBlank private String city;
    @NotBlank private String state;
    @NotBlank private String pincode;
    @NotBlank private String phone;
    private boolean isDefault;

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }
    public String getLine1() { return line1; }
    public void setLine1(String line1) { this.line1 = line1; }
    public String getLine2() { return line2; }
    public void setLine2(String line2) { this.line2 = line2; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    // Without this, Jackson expects JSON key "default" (from the isXxx()/setXxx() naming
    // convention) instead of "isDefault", so the "Set as default" checkbox the frontend sends
    // as `{ isDefault: true }` was silently dropped as an unrecognized property.
    @JsonProperty("isDefault")
    public boolean isDefault() { return isDefault; }

    @JsonProperty("isDefault")
    public void setDefault(boolean aDefault) { isDefault = aDefault; }
}
