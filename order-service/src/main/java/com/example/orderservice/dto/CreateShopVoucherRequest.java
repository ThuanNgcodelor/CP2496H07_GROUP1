package com.example.orderservice.dto;

import com.example.orderservice.enums.DiscountType;
import com.example.orderservice.enums.VoucherScope;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CreateShopVoucherRequest {

    @NotBlank(message = "Shop Owner ID is required")
    private String shopOwnerId;

    @NotBlank(message = "Voucher code is required")
    private String code;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Discount type is required")
    private DiscountType discountType;

    @NotNull(message = "Discount value is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Discount value must be greater than 0")
    private BigDecimal discountValue;

    private BigDecimal maxDiscountAmount;

    @DecimalMin(value = "0.0", message = "Min order value must be non-negative")
    private BigDecimal minOrderValue;

    @NotNull(message = "Start time is required")
    private LocalDateTime startAt;

    @NotNull(message = "End time is required")
    private LocalDateTime endAt;

    @Min(value = 1, message = "Total quantity must be at least 1")
    private Integer quantityTotal;

    @NotNull(message = "Applicable scope is required")
    private VoucherScope applicableScope;

    private List<String> productIds;
}
