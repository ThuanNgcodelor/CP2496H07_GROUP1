package com.example.userservice.dto.subscription;

import com.example.userservice.enums.PaymentStatus;
import com.example.userservice.enums.PlanDuration;
import com.example.userservice.enums.SubscriptionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShopSubscriptionDto {
    private String id;
    private String shopOwnerId;
    private String shopOwnerName;
    private String planId;
    private String planCode;
    private SubscriptionType subscriptionType;
    private PlanDuration planDuration;
    private BigDecimal pricePaid;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean isActive;
    private Boolean autoRenew;
    private PaymentStatus paymentStatus;
    private LocalDateTime createdAt;
}
