package com.example.orderservice.service;

import com.example.orderservice.dto.CreateShopVoucherRequest;
import com.example.orderservice.enums.VoucherScope;
import com.example.orderservice.enums.VoucherType;
import com.example.orderservice.model.ShopVoucher;
import com.example.orderservice.model.VoucherApplicability;
import com.example.orderservice.repository.ShopVoucherRepository;
import com.example.orderservice.repository.VoucherApplicabilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ShopVoucherServiceImpl implements ShopVoucherService {

    private final ShopVoucherRepository shopVoucherRepository;
    private final VoucherApplicabilityRepository voucherApplicabilityRepository;

    @Override
    @Transactional
    public ShopVoucher createShopVoucher(CreateShopVoucherRequest request) {
        if (shopVoucherRepository.existsByShopOwnerIdAndCode(request.getShopOwnerId(), request.getCode())) {
            throw new IllegalArgumentException("Voucher code already exists for this shop");
        }

        if (request.getEndAt().isBefore(request.getStartAt())) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        if (request.getEndAt().isBefore(LocalDateTime.now())) {
            // It's possible to create a voucher that expired if we are migrating data, but
            // for new creation it usually should be future.
            // But let's strictly follow logic: if endAt is past, it's useless but maybe
            // allowed?
            // Logic: usually endAt > now.
            throw new IllegalArgumentException("End time must be in the future");
        }

        ShopVoucher shopVoucher = ShopVoucher.builder()
                .shopOwnerId(request.getShopOwnerId())
                .code(request.getCode())
                .title(request.getTitle())
                .description(request.getDescription())
                .discountType(request.getDiscountType())
                .discountValue(request.getDiscountValue())
                .maxDiscountAmount(request.getMaxDiscountAmount())
                .minOrderValue(request.getMinOrderValue())
                .startAt(request.getStartAt())
                .endAt(request.getEndAt())
                .quantityTotal(request.getQuantityTotal())
                .quantityUsed(0)
                .applicableScope(request.getApplicableScope())
                // status default is ACTIVE
                .build();

        ShopVoucher savedVoucher = shopVoucherRepository.save(shopVoucher);

        if (request.getApplicableScope() == VoucherScope.SELECTED_PRODUCTS) {
            if (request.getProductIds() != null && !request.getProductIds().isEmpty()) {
                for (String productId : request.getProductIds()) {
                    VoucherApplicability applicability = new VoucherApplicability();
                    applicability.setVoucherId(savedVoucher.getId());
                    applicability.setVoucherType(VoucherType.SHOP);
                    applicability.setProductId(productId);
                    voucherApplicabilityRepository.save(applicability);
                }
            }
        }

        return savedVoucher;
    }
}