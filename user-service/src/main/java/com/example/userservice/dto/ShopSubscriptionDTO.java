package com.example.userservice.dto;

import com.example.userservice.enums.SubscriptionType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ShopSubscriptionDTO {
    private String id;
    private String shopOwnerId;
    private SubscriptionType subscriptionType;
    private BigDecimal commissionPaymentRate;
    private BigDecimal commissionFixedRate;
    private BigDecimal commissionFreeshipRate;
    private BigDecimal commissionVoucherRate;
    private BigDecimal voucherMaxPerItem;
    private Boolean freeshipEnabled;
    private Boolean voucherEnabled;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean isActive;
}
