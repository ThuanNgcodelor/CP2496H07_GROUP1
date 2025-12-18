package com.example.userservice.request.subscription;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateFeatureRequest {

    @Size(max = 255, message = "Feature text must not exceed 255 characters")
    private String featureText;

    @Min(value = 0, message = "Display order must be >= 0")
    private Integer displayOrder;
}
