package com.example.stockservice.request.flashsale;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FlashSaleSessionRequest {
    private String name;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String description;
}
