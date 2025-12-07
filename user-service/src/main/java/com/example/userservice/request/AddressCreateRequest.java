package com.example.userservice.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddressCreateRequest {
    
    @NotBlank(message = "Recipient name is required")
    private String recipientName;
    
    @NotBlank(message = "Recipient phone is required")
    private String recipientPhone;
    
    // GHN Fields - REQUIRED
    @NotNull(message = "Province ID is required (GHN)")
    private Integer provinceId;
    
    @NotBlank(message = "Province name is required")
    private String provinceName;
    
    @NotNull(message = "District ID is required (GHN)")
    private Integer districtId;
    
    @NotBlank(message = "District name is required")
    private String districtName;
    
    @NotBlank(message = "Ward code is required (GHN)")
    private String wardCode;
    
    @NotBlank(message = "Ward name is required")
    private String wardName;
    
    @NotBlank(message = "Street address is required")
    private String streetAddress;
    
    private String addressName; // "Nhà riêng", "Văn Phòng"
    private Boolean isDefault;
    
    // Coordinates (optional)
    private Double latitude;
    private Double longitude;
    
    // For backward compatibility - will be set from GHN fields
    private String userId;
    private String province;
}
