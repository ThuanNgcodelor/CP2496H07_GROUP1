package com.example.userservice.dto.subscription;

import com.example.userservice.enums.PlanDuration;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionPlanPricingDto {
    private String id;
    private String planId;
    private PlanDuration planDuration;
    private BigDecimal price;
    private Boolean isActive;
}
