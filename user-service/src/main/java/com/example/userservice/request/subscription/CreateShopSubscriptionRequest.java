package com.example.userservice.request.subscription;

import com.example.userservice.enums.PlanDuration;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateShopSubscriptionRequest {
    @NotBlank(message = "Plan ID is required")
    private String planId;

    @NotNull(message = "Duration is required")
    private PlanDuration duration; // MONTHLY, YEARLY
}
