package com.example.userservice.service.shopowner;

import com.example.userservice.dto.ShopSubscriptionDTO;
import com.example.userservice.model.ShopSubscription;
import com.example.userservice.repository.ShopSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ShopSubscriptionServiceImpl implements ShopSubscriptionService {

    private final ShopSubscriptionRepository shopSubscriptionRepository;

    @Override
    public ShopSubscriptionDTO getActiveSubscription(String shopOwnerId) {
        Optional<ShopSubscription> subOpt = shopSubscriptionRepository.findByShopOwnerIdAndIsActiveTrue(shopOwnerId);

        if (subOpt.isEmpty()) {
            return null;
        }

        ShopSubscription sub = subOpt.get();
        return ShopSubscriptionDTO.builder()
                .id(sub.getId())
                .shopOwnerId(sub.getShopOwnerId())
                .subscriptionType(sub.getSubscriptionType())
                .commissionPaymentRate(sub.getCommissionPaymentRate())
                .commissionFixedRate(sub.getCommissionFixedRate())
                .commissionFreeshipRate(sub.getCommissionFreeshipRate())
                .commissionVoucherRate(sub.getCommissionVoucherRate())
                .voucherMaxPerItem(sub.getVoucherMaxPerItem())
                .freeshipEnabled(sub.getFreeshipEnabled())
                .voucherEnabled(sub.getVoucherEnabled())
                .startDate(sub.getStartDate())
                .endDate(sub.getEndDate())
                .isActive(sub.getIsActive())
                .build();
    }
}
