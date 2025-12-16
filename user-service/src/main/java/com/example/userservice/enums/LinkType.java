package com.example.userservice.enums;

public enum LinkType {
    NONE, // Không có link
    INTERNAL, // Link nội bộ trong app (VD: /products, /categories)
    EXTERNAL, // Link ra ngoài (VD: https://external.com)
    PRODUCT, // Link đến sản phẩm cụ thể (target_id = product_id)
    CATEGORY // Link đến danh mục (target_id = category_id)
}
