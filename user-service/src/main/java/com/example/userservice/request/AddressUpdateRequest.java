package com.example.userservice.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddressUpdateRequest {
    @NotBlank(message = "Address ID is required")
    public String id;
    
    public String userId;
    
    @NotBlank(message = "Recipient name is required")
    public String recipientName;
    
    @NotBlank(message = "Recipient phone is required")
    public String recipientPhone;
    
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
    public String streetAddress;
    
    public String addressName; // "Nhà riêng", "Văn Phòng"
    public Boolean isDefault;
    
    // Coordinates (optional)
    private Double latitude;
    private Double longitude;
    
    // For backward compatibility
    public String province;
}
