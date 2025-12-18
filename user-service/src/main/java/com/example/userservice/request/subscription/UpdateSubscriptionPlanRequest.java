package com.example.userservice.request.subscription;

import com.example.userservice.enums.SubscriptionType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSubscriptionPlanRequest {

    @Size(min = 3, max = 255, message = "Name must be between 3 and 255 characters")
    private String name;

    private String description;

    private SubscriptionType subscriptionType;

    @Min(value = 0, message = "Display order must be >= 0")
    private Integer displayOrder;

    @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "Invalid color hex format")
    private String colorHex;

    @Size(max = 100, message = "Icon must not exceed 100 characters")
    private String icon;

    // Commission rates
    @DecimalMin(value = "0.0", message = "Commission payment rate must be >= 0")
    @DecimalMax(value = "1.0", message = "Commission payment rate must be <= 1")
    @Digits(integer = 1, fraction = 4, message = "Commission payment rate must have at most 4 decimal places")
    private BigDecimal commissionPaymentRate;

    @DecimalMin(value = "0.0", message = "Commission fixed rate must be >= 0")
    @DecimalMax(value = "1.0", message = "Commission fixed rate must be <= 1")
    @Digits(integer = 1, fraction = 4, message = "Commission fixed rate must have at most 4 decimal places")
    private BigDecimal commissionFixedRate;

    @DecimalMin(value = "0.0", message = "Commission freeship rate must be >= 0")
    @DecimalMax(value = "1.0", message = "Commission freeship rate must be <= 1")
    @Digits(integer = 1, fraction = 4, message = "Commission freeship rate must have at most 4 decimal places")
    private BigDecimal commissionFreeshipRate;

    @DecimalMin(value = "0.0", message = "Commission voucher rate must be >= 0")
    @DecimalMax(value = "1.0", message = "Commission voucher rate must be <= 1")
    @Digits(integer = 1, fraction = 4, message = "Commission voucher rate must have at most 4 decimal places")
    private BigDecimal commissionVoucherRate;

    @DecimalMin(value = "0.0", message = "Voucher max per item must be >= 0")
    private BigDecimal voucherMaxPerItem;

    private Boolean freeshipEnabled;
    private Boolean voucherEnabled;
    private Boolean isActive;
}
