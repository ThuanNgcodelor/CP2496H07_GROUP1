package com.example.orderservice.service;

import com.example.orderservice.dto.VoucherValidateResponse;
import com.example.orderservice.enums.DiscountType;
import com.example.orderservice.enums.VoucherStatus;
import com.example.orderservice.enums.VoucherType;
import com.example.orderservice.model.ShopVoucher;
import com.example.orderservice.model.VoucherUsage;
import com.example.orderservice.repository.ShopVoucherRepository;
import com.example.orderservice.repository.VoucherUsageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class VoucherService {

    private final ShopVoucherRepository shopVoucherRepository;
    private final VoucherUsageRepository voucherUsageRepository;

    /**
     * Apply voucher to order - increment usage count and create usage record
     */
    @Transactional
    public void applyVoucherToOrder(String voucherId, String orderId, String userId, BigDecimal discountAmount) {
        if (voucherId == null || voucherId.isBlank()) {
            log.warn("[VOUCHER] VoucherId is null or blank, skipping voucher application");
            return;
        }

        // Find voucher
        ShopVoucher voucher = shopVoucherRepository.findById(voucherId).orElse(null);
        if (voucher == null) {
            log.warn("[VOUCHER] Voucher not found: {}", voucherId);
            return;
        }

        // Check if already used for this order (idempotency)
        if (voucherUsageRepository.existsByVoucherIdAndOrderId(voucherId, orderId)) {
            log.info("[VOUCHER] Voucher {} already applied to order {}", voucherId, orderId);
            return;
        }

        // Increment usage count
        voucher.setQuantityUsed(voucher.getQuantityUsed() + 1);
        shopVoucherRepository.save(voucher);
        log.info("[VOUCHER] Incremented usage count for voucher {}: {}/{}", 
                voucherId, voucher.getQuantityUsed(), voucher.getQuantityTotal());

        // Create usage record
        VoucherUsage usage = new VoucherUsage();
        usage.setVoucherId(voucherId);
        usage.setVoucherType(VoucherType.SHOP);
        usage.setOrderId(orderId);
        usage.setUserId(userId);
        usage.setAmountDiscount(discountAmount != null ? discountAmount : BigDecimal.ZERO);
        voucherUsageRepository.save(usage);
        
        log.info("[VOUCHER] Created voucher usage record for order {}, discount: {}", orderId, discountAmount);
    }

    /**
     * Get shopOwnerId from voucherId
     * Returns null if voucher not found (for platform vouchers, handle separately)
     */
    public String getVoucherShopOwnerId(String voucherId) {
        if (voucherId == null || voucherId.isBlank()) {
            return null;
        }
        ShopVoucher voucher = shopVoucherRepository.findById(voucherId).orElse(null);
        return voucher != null ? voucher.getShopOwnerId() : null;
    }

    /**
     * Validate ShopVoucher và tính số tiền giảm cho đơn hàng
     */
    public VoucherValidateResponse validateShopVoucher(String code, String shopOwnerId, BigDecimal orderAmount) {
        // Tìm voucher theo code + shopOwnerId
        ShopVoucher voucher = shopVoucherRepository
                .findByCodeAndShopOwnerId(code.toUpperCase(), shopOwnerId)
                .orElse(null);

        if (voucher == null) {
            return VoucherValidateResponse.builder()
                    .valid(false)
                    .message("Voucher không tồn tại hoặc không áp dụng cho shop này")
                    .build();
        }

        // Validate status
        if (voucher.getStatus() != VoucherStatus.ACTIVE) {
            return VoucherValidateResponse.builder()
                    .valid(false)
                    .message("Voucher không còn hiệu lực")
                    .build();
        }

        // Validate time
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(voucher.getStartAt())) {
            return VoucherValidateResponse.builder()
                    .valid(false)
                    .message("Voucher chưa đến thời gian sử dụng")
                    .build();
        }
        if (now.isAfter(voucher.getEndAt())) {
            return VoucherValidateResponse.builder()
                    .valid(false)
                    .message("Voucher đã hết hạn")
                    .build();
        }

        // Validate quantity
        if (voucher.getQuantityUsed() >= voucher.getQuantityTotal()) {
            return VoucherValidateResponse.builder()
                    .valid(false)
                    .message("Voucher đã hết lượt sử dụng")
                    .build();
        }

        // Validate min order value
        if (voucher.getMinOrderValue() != null && orderAmount.compareTo(voucher.getMinOrderValue()) < 0) {
            return VoucherValidateResponse.builder()
                    .valid(false)
                    .message("Đơn hàng chưa đạt giá trị tối thiểu " + voucher.getMinOrderValue() + "đ")
                    .build();
        }

        // Calculate discount
        BigDecimal discount = calculateDiscount(voucher, orderAmount);

        return VoucherValidateResponse.builder()
                .valid(true)
                .voucherId(voucher.getId())
                .code(voucher.getCode())
                .title(voucher.getTitle())
                .discount(discount)
                .message("Áp dụng voucher thành công")
                .build();
    }

    /**
     * Lấy danh sách voucher đang ACTIVE của một shop
     */
    public List<ShopVoucher> getActiveShopVouchers(String shopOwnerId) {
        return shopVoucherRepository.findByShopOwnerIdAndStatus(shopOwnerId, VoucherStatus.ACTIVE);
    }

    /**
     * Lấy thông tin voucher theo code cho một shop (không tính toán discount)
     */
    public VoucherValidateResponse getShopVoucherByCode(String code, String shopOwnerId) {
        ShopVoucher voucher = shopVoucherRepository
                .findByCodeAndShopOwnerId(code.toUpperCase(), shopOwnerId)
                .orElse(null);

        if (voucher == null) {
            return VoucherValidateResponse.builder()
                    .valid(false)
                    .message("Voucher không tồn tại")
                    .build();
        }

        return VoucherValidateResponse.builder()
                .valid(true)
                .voucherId(voucher.getId())
                .code(voucher.getCode())
                .title(voucher.getTitle())
                .message("Tìm thấy voucher")
                .build();
    }

    /**
     * Logic tính số tiền giảm cho ShopVoucher
     */
    private BigDecimal calculateDiscount(ShopVoucher voucher, BigDecimal orderAmount) {
        BigDecimal discount;

        if (voucher.getDiscountType() == DiscountType.PERCENT) {
            // Giảm theo phần trăm
            discount = orderAmount
                    .multiply(voucher.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 0, RoundingMode.FLOOR);
        } else {
            // Giảm cố định
            discount = voucher.getDiscountValue();
        }

        // Áp dụng max discount nếu có
        if (voucher.getMaxDiscountAmount() != null && discount.compareTo(voucher.getMaxDiscountAmount()) > 0) {
            discount = voucher.getMaxDiscountAmount();
        }

        // Không giảm quá giá trị đơn hàng
        if (discount.compareTo(orderAmount) > 0) {
            discount = orderAmount;
        }

        return discount;
    }
}

