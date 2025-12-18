package com.example.userservice.request.subscription;

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
public class UpdatePricingRequest {

    @DecimalMin(value = "0.0", message = "Price must be >= 0")
    private BigDecimal price;

    private Boolean isActive;
}
