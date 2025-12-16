package com.example.userservice.request;

import com.example.userservice.enums.BannerPosition;
import com.example.userservice.enums.LinkType;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
public class CreateBannerRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private String altText;

    // Link
    private String linkUrl;
    private LinkType linkType = LinkType.NONE;
    private String targetId;
    private Boolean openInNewTab = false;

    // Position
    @NotNull(message = "Position is required")
    private BannerPosition position;

    private Integer displayOrder = 0;

    // Schedule
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    // Status
    private Boolean isActive = true;
}
