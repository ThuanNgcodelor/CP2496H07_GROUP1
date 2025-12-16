package com.example.userservice.request;

import com.example.userservice.enums.BannerPosition;
import com.example.userservice.enums.LinkType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UpdateBannerRequest {
    private String title;
    private String description;
    private String altText;

    private String linkUrl;
    private LinkType linkType;
    private String targetId;
    private Boolean openInNewTab;

    private BannerPosition position;
    private Integer displayOrder;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private Boolean isActive;
}
