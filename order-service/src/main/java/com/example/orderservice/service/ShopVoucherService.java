package com.example.orderservice.service;

import com.example.orderservice.dto.CreateShopVoucherRequest;
import com.example.orderservice.model.ShopVoucher;

public interface ShopVoucherService {
    ShopVoucher createShopVoucher(CreateShopVoucherRequest request);
}
