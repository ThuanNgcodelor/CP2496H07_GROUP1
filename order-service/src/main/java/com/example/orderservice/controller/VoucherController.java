package com.example.orderservice.controller;

import com.example.orderservice.dto.VoucherValidateResponse;
import com.example.orderservice.model.ShopVoucher;
import com.example.orderservice.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/v1/order/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherService voucherService;

    /**
     * Validate voucher và tính discount
     */
    @GetMapping("/validate")
    public ResponseEntity<VoucherValidateResponse> validateVoucher(
            @RequestParam String code,
            @RequestParam String shopOwnerId,
            @RequestParam BigDecimal orderAmount
    ) {
        VoucherValidateResponse response = voucherService.validateShopVoucher(code, shopOwnerId, orderAmount);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy danh sách voucher của shop
     */
    @GetMapping("/shop/{shopOwnerId}")
    public ResponseEntity<List<ShopVoucher>> getShopVouchers(@PathVariable String shopOwnerId) {
        List<ShopVoucher> vouchers = voucherService.getActiveShopVouchers(shopOwnerId);
        return ResponseEntity.ok(vouchers);
    }

    /**
     * Lấy voucher theo code (cho frontend hiển thị)
     */
    @GetMapping("/by-code")
    public ResponseEntity<VoucherValidateResponse> getVoucherByCode(
            @RequestParam String code,
            @RequestParam String shopOwnerId
    ) {
        VoucherValidateResponse response = voucherService.getShopVoucherByCode(code, shopOwnerId);
        return ResponseEntity.ok(response);
    }
}

