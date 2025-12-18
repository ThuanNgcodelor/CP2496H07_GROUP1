package com.example.userservice.dto.subscription;

import com.example.userservice.enums.SubscriptionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionPlanDto {
    private String id;
    private String code;
    private String name;
    private String description;
    private SubscriptionType subscriptionType;
    private Boolean isActive;
    private Integer displayOrder;
    private String colorHex;
    private String icon;

    // Commission rates
    private BigDecimal commissionPaymentRate;
    private BigDecimal commissionFixedRate;
    private BigDecimal commissionFreeshipRate;
    private BigDecimal commissionVoucherRate;
    private BigDecimal voucherMaxPerItem;

    private Boolean freeshipEnabled;
    private Boolean voucherEnabled;

    // Relations
    private List<SubscriptionPlanPricingDto> pricing;
    private List<SubscriptionPlanFeatureDto> features;

    // Metadata
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
