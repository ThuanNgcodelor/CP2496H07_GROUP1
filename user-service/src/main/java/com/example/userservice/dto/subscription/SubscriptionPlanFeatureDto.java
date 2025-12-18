package com.example.userservice.dto.subscription;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionPlanFeatureDto {
    private String id;
    private String planId;
    private String featureText;
    private Integer displayOrder;
}
