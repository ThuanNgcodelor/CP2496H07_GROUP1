package com.example.notificationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShopOwnerDto {
    private String userId;
    private String shopName;
    private String ownerName;
    private String address;
    private String phone;
    private String imageUrl; // This is likely the logo
    private String email;
}
