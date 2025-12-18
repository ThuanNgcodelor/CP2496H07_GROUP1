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
    private final com.example.userservice.repository.SubscriptionPlanRepository subscriptionPlanRepository;
    private final com.example.userservice.repository.SubscriptionPlanPricingRepository subscriptionPlanPricingRepository;

    @Override
    public ShopSubscriptionDTO getActiveSubscription(String shopOwnerId) {
        Optional<ShopSubscription> subOpt = shopSubscriptionRepository.findByShopOwnerIdAndIsActiveTrue(shopOwnerId);

        if (subOpt.isEmpty()) {
            return null;
        }

        ShopSubscription sub = subOpt.get();
        return toDto(sub);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public ShopSubscriptionDTO subscribe(String shopOwnerId,
            com.example.userservice.request.subscription.CreateShopSubscriptionRequest request) {
        // 1. Get Plan
        com.example.userservice.model.SubscriptionPlan plan = subscriptionPlanRepository.findById(request.getPlanId())
                .orElseThrow(() -> new RuntimeException("Subscription Plan not found"));

        if (!plan.getIsActive()) {
            throw new RuntimeException("This plan is not active");
        }

        // 2. Get Pricing
        com.example.userservice.model.SubscriptionPlanPricing pricing = subscriptionPlanPricingRepository
                .findByPlanIdAndPlanDuration(plan.getId(), request.getDuration())
                .orElseThrow(() -> new RuntimeException("Pricing not found for duration: " + request.getDuration()));

        // 3. Deactivate current active subscription if exists
        Optional<ShopSubscription> currentSubOpt = shopSubscriptionRepository
                .findByShopOwnerIdAndIsActiveTrue(shopOwnerId);
        if (currentSubOpt.isPresent()) {
            ShopSubscription currentSub = currentSubOpt.get();
            currentSub.setIsActive(false);
            currentSub.setEndDate(java.time.LocalDateTime.now()); // End now
            currentSub.setCancelledAt(java.time.LocalDateTime.now());
            currentSub.setCancellationReason("Upgrade/Downgrade to new plan: " + plan.getName());
            shopSubscriptionRepository.save(currentSub);
        }

        // 4. Calculate Dates
        java.time.LocalDateTime startDate = java.time.LocalDateTime.now();
        java.time.LocalDateTime endDate;
        if (request.getDuration() == com.example.userservice.enums.PlanDuration.MONTHLY) {
            endDate = startDate.plusMonths(1);
        } else {
            endDate = startDate.plusYears(1);
        }

        // 5. Create new Subscription (Snapshotting values)
        ShopSubscription newSub = ShopSubscription.builder()
                .shopOwnerId(shopOwnerId)
                .plan(plan)
                .planCode(plan.getCode())
                .subscriptionType(plan.getSubscriptionType())
                .planDuration(pricing.getPlanDuration())
                .pricePaid(pricing.getPrice())
                .startDate(startDate)
                .endDate(endDate)
                .isActive(true)
                .autoRenew(false) // Default false
                .paymentStatus(com.example.userservice.enums.PaymentStatus.PAID) // Mocking immediate payment
                // Snapshot Commission Rates
                .commissionPaymentRate(plan.getCommissionPaymentRate())
                .commissionFixedRate(plan.getCommissionFixedRate())
                .commissionFreeshipRate(plan.getCommissionFreeshipRate())
                .commissionVoucherRate(plan.getCommissionVoucherRate())
                .voucherMaxPerItem(plan.getVoucherMaxPerItem())
                .freeshipEnabled(plan.getFreeshipEnabled())
                .voucherEnabled(plan.getVoucherEnabled())
                .build();

        newSub = shopSubscriptionRepository.save(newSub);

        return toDto(newSub);
    }

    private ShopSubscriptionDTO toDto(ShopSubscription sub) {
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
