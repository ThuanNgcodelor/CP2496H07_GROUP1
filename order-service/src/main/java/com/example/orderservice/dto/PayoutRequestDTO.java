package com.example.orderservice.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PayoutRequestDTO {
    private BigDecimal amount;
    private String bankAccountNumber;
    private String bankName;
    private String accountHolderName;
    private String description;
}
