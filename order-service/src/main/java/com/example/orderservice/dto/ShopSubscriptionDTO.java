package com.example.orderservice.dto;

import com.example.orderservice.enums.SubscriptionType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ShopSubscriptionDTO {
    private String id;
    private String shopOwnerId;
    private SubscriptionType subscriptionType; // FREESHIP_XTRA, VOUCHER_XTRA, BOTH, NONE
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
