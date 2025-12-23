package com.example.orderservice.controller;

import com.example.orderservice.dto.CreateShopVoucherRequest;
import com.example.orderservice.model.ShopVoucher;
import com.example.orderservice.service.ShopVoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/order/shop-vouchers")
@RequiredArgsConstructor
public class ShopVoucherController {

    private final ShopVoucherService shopVoucherService;

    @PostMapping
    public ResponseEntity<ShopVoucher> createShopVoucher(@Valid @RequestBody CreateShopVoucherRequest request) {
        ShopVoucher createdVoucher = shopVoucherService.createShopVoucher(request);
        return new ResponseEntity<>(createdVoucher, HttpStatus.CREATED);
    }

    @org.springframework.web.bind.annotation.GetMapping("/shops/{shopOwnerId}")
    public ResponseEntity<java.util.List<ShopVoucher>> getShopVouchers(
            @org.springframework.web.bind.annotation.PathVariable String shopOwnerId) {
        return ResponseEntity.ok(shopVoucherService.getAllShopVouchers(shopOwnerId));
    }

    @org.springframework.web.bind.annotation.PutMapping("/{voucherId}")
    public ResponseEntity<ShopVoucher> updateShopVoucher(
            @org.springframework.web.bind.annotation.PathVariable String voucherId,
            @RequestBody CreateShopVoucherRequest request) {
        return ResponseEntity.ok(shopVoucherService.updateShopVoucher(voucherId, request));
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/{voucherId}")
    public ResponseEntity<Void> deleteShopVoucher(
            @org.springframework.web.bind.annotation.PathVariable String voucherId) {
        shopVoucherService.deleteShopVoucher(voucherId);
        return ResponseEntity.noContent().build();
    }
}
