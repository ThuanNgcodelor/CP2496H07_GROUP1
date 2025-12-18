package com.example.userservice.dto.subscription;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionStatsDto {
    private String planId;
    private String planName;
    private Long totalSubscriptions;
    private Long activeSubscriptions;
    private BigDecimal totalRevenue;
    private BigDecimal monthlyRevenue;
}
