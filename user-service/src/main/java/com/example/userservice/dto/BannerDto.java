package com.example.userservice.dto;

import com.example.userservice.enums.BannerPosition;
import com.example.userservice.enums.LinkType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BannerDto {
    private String id;
    private String title;
    private String description;

    // Image
    private String imageId;
    private String imageUrl;
    private String altText;

    // Link
    private String linkUrl;
    private LinkType linkType;
    private String targetId;
    private Boolean openInNewTab;

    // Position
    private BannerPosition position;
    private Integer displayOrder;

    // Schedule
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    // Status
    private Boolean isActive;

    // Analytics
    private Integer clickCount;
    private Integer viewCount;

    // Metadata
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
