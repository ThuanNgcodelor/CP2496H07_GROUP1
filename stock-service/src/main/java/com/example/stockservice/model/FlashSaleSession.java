package com.example.stockservice.model;

import com.example.stockservice.enums.FlashSaleStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "flash_sale_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashSaleSession extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FlashSaleStatus status;

    private String description;
}
