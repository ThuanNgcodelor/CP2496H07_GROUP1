package com.example.userservice.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "addresses")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Address extends BaseEntity {
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @Column(name = "address_name")
    private String addressName;
    
    @Column(name = "recipient_name", nullable = false)
    private String recipientName;
    
    @Column(name = "recipient_phone", nullable = false)
    private String recipientPhone;
    
    // ============ GHN ADDRESS STRUCTURE (3 CẤP) ============
    
    @Column(name = "province_id")
    private Integer provinceId;
    
    @Column(name = "province_name")
    private String provinceName;
    
    @Column(name = "district_id")
    private Integer districtId;
    
    @Column(name = "district_name")
    private String districtName;
    
    @Column(name = "ward_code", length = 20)
    private String wardCode;
    
    @Column(name = "ward_name")
    private String wardName;
    
    // =======================================================
    
    @Column(name = "street_address", columnDefinition = "TEXT", nullable = false)
    private String streetAddress;
    
    @Column(name = "is_default")
    @Builder.Default
    private Boolean isDefault = false;
    
    // Coordinates for map display
    @Column(name = "latitude")
    private Double latitude;
    
    @Column(name = "longitude")
    private Double longitude;
    
    // DEPRECATED - Giữ để tương thích ngược
    @Deprecated
    @Column(name = "province")
    private String province;
    
    @Deprecated
    @Column(name = "district")
    private String district;
    
    @Deprecated
    @Column(name = "city")
    private String city;
    
    /**
     * Helper method: Tạo địa chỉ đầy đủ cho GHN
     */
    public String getFullAddress() {
        StringBuilder sb = new StringBuilder();
        if (streetAddress != null && !streetAddress.isBlank()) {
            sb.append(streetAddress);
        }
        if (wardName != null && !wardName.isBlank()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(wardName);
        }
        if (districtName != null && !districtName.isBlank()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(districtName);
        }
        if (provinceName != null && !provinceName.isBlank()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(provinceName);
        }
        return sb.toString();
    }
    
    // Method tính khoảng cách (giữ lại từ code cũ)
    public double calculateDistance(double targetLat, double targetLng) {
        if (latitude == null || longitude == null) return Double.MAX_VALUE;
        return calculateHaversineDistance(latitude, longitude, targetLat, targetLng);
    }
    
    private double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
