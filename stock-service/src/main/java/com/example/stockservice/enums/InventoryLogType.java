package com.example.stockservice.enums;

public enum InventoryLogType {
    IMPORT, // Batch import or manual add
    ORDER, // Sold to customer
    CANCEL, // Order cancelled (restock)
    RETURN, // Customer returned (restock)
    ADJUSTMENT, // Manual correction
    SYSTEM // System auto-correction (rare)
}
