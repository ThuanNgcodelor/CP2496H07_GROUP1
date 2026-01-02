package com.example.stockservice.model;

import com.example.stockservice.enums.InventoryLogType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

// import java.time.LocalDateTime;

@Entity(name = "inventory_logs")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InventoryLog extends BaseEntity {
    private String productId;
    private String sizeId; // Optional, null if product has no sizes

    private String productName;
    private String sizeName;

    private int changeAmount; // Positive for IN, Negative for OUT
    private int currentStock; // Snapshotted stock after change

    @Enumerated(EnumType.STRING)
    private InventoryLogType type;

    private String reason; // "Import", "Order #123", "Return #456", "Manual Fix", "Low Stock Auto"

    private String userId; // Shop Owner ID who owns this product or performed action
}
