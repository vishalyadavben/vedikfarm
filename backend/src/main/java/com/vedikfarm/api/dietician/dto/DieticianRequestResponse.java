package com.vedikfarm.api.dietician.dto;

import com.vedikfarm.api.dietician.DieticianRequest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class DieticianRequestResponse {
    public Long id;
    public String name;
    public LocalDate dateOfBirth;
    public int age;
    public BigDecimal heightCm;
    public String disease;
    public String status;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;
    public String phone;
    // Only filled in for the admin list, so the team knows how to reach the customer.
    public String email;

    public static DieticianRequestResponse from(DieticianRequest r) {
        DieticianRequestResponse d = new DieticianRequestResponse();
        d.id = r.getId();
        d.name = r.getName();
        d.dateOfBirth = r.getDateOfBirth();
        d.age = r.getAge();
        d.heightCm = r.getHeightCm();
        d.phone = r.getPhone();
        d.disease = r.getDisease();
        d.status = r.getStatus();
        d.createdAt = r.getCreatedAt();
        d.updatedAt = r.getUpdatedAt();
        return d;
    }
}
