package com.example.userservice.request.subscription;

import com.example.userservice.enums.PlanDuration;
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
public class CreatePricingRequest {

    @NotNull(message = "Plan duration is required")
    private PlanDuration planDuration;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", message = "Price must be >= 0")
    private BigDecimal price;

    private Boolean isActive = true;
}
