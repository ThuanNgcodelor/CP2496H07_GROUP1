package com.example.userservice.model;

import com.example.userservice.enums.BannerPosition;
import com.example.userservice.enums.LinkType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "banners", indexes = {
        @Index(name = "idx_position_order", columnList = "position, display_order"),
        @Index(name = "idx_active_date", columnList = "is_active, start_date, end_date"),
        @Index(name = "idx_position_active", columnList = "position, is_active")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Banner {

    @Id
    @Column(length = 255)
    private String id;

    // Basic Information
    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Image
    @Column(name = "image_id", nullable = false, length = 255)
    private String imageId;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "alt_text", length = 255)
    private String altText;

    // Link & Navigation
    @Column(name = "link_url", length = 500)
    private String linkUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "link_type", nullable = false)
    private LinkType linkType = LinkType.NONE;

    @Column(name = "target_id", length = 255)
    private String targetId;

    @Column(name = "open_in_new_tab")
    private Boolean openInNewTab = false;

    // Banner Position (3 vị trí)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BannerPosition position;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    // Auto-Scheduling
    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    // Manual Toggle
    @Column(name = "is_active")
    private Boolean isActive = true;

    // Analytics
    @Column(name = "click_count")
    private Integer clickCount = 0;

    @Column(name = "view_count")
    private Integer viewCount = 0;

    // Metadata
    @Column(name = "created_by", length = 255)
    private String createdBy;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (id == null) {
            id = java.util.UUID.randomUUID().toString();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
