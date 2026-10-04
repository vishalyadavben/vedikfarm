package com.vedikfarm.api.dietician.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

/** Age is deliberately not accepted from the client - it is always calculated from the date of birth. */
public class DieticianRequestBody {
    @NotBlank @Size(max = 150) private String name;
    @NotNull @Past private LocalDate dateOfBirth;
    @NotNull @DecimalMin("50.0") @DecimalMax("260.0") private BigDecimal heightCm;
    @NotBlank @Pattern(regexp = "^\\+?[0-9][0-9 \\-]{8,18}$", message = "enter a valid contact number")
    private String phone;
    @Size(max = 2000) private String disease;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public BigDecimal getHeightCm() { return heightCm; }
    public void setHeightCm(BigDecimal heightCm) { this.heightCm = heightCm; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getDisease() { return disease; }
    public void setDisease(String disease) { this.disease = disease; }
}
