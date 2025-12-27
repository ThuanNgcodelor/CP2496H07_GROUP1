package com.example.orderservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request body for bulk update order status
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkUpdateStatusRequest {
    private List<String> orderIds;
    private String newStatus;
}
