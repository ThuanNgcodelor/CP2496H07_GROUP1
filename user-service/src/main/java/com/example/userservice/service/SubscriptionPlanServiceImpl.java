package com.example.userservice.service;

import com.example.userservice.dto.subscription.*;
import com.example.userservice.exception.NotFoundException;
import com.example.userservice.model.*;
import com.example.userservice.repository.*;
import com.example.userservice.request.subscription.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionPlanServiceImpl implements SubscriptionPlanService {

    private final SubscriptionPlanRepository planRepository;
    private final SubscriptionPlanPricingRepository pricingRepository;
    private final SubscriptionPlanFeatureRepository featureRepository;
    private final ShopSubscriptionRepository shopSubscriptionRepository;

    // ============ PUBLIC APIs ============
    @Override
    public List<SubscriptionPlanDto> getActivePlans() {
        log.info("Fetching all active plans");
        return planRepository.findAllByIsActiveTrue().stream()
                .map(this::toPlanDto)
                .collect(Collectors.toList());
    }

    @Override
    public SubscriptionPlanDto getPlanByCode(String code) {
        log.info("Fetching plan by code: {}", code);
        SubscriptionPlan plan = planRepository.findByCode(code)
                .orElseThrow(() -> new NotFoundException("Plan not found with code: " + code));
        return toPlanDto(plan);
    }

    // ============ ADMIN APIs - Plan CRUD ============

    @Override
    public List<SubscriptionPlanDto> getAllPlans() {
        log.info("Fetching all plans");
        return planRepository.findAllOrderByDisplayOrder().stream()
                .map(this::toPlanDto)
                .collect(Collectors.toList());
    }

    @Override
    public SubscriptionPlanDto getPlanById(String id) {
        log.info("Fetching plan by id: {}", id);
        return toPlanDto(getPlan(id));
    }

    @Override
    @Transactional
    public SubscriptionPlanDto createPlan(CreateSubscriptionPlanRequest request) {
        log.info("Creating new plan: {}", request.getCode());

        if (planRepository.existsByCode(request.getCode())) {
            throw new IllegalArgumentException("Plan code already exists: " + request.getCode());
        }

        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setCode(request.getCode());
        plan.setName(request.getName());
        plan.setDescription(request.getDescription());
        plan.setSubscriptionType(request.getSubscriptionType());
        plan.setColorHex(request.getColorHex());
        plan.setIcon(request.getIcon());
        plan.setDisplayOrder(request.getDisplayOrder());
        plan.setCommissionPaymentRate(request.getCommissionPaymentRate());
        plan.setCommissionFixedRate(request.getCommissionFixedRate());
        plan.setCommissionFreeshipRate(request.getCommissionFreeshipRate());
        plan.setCommissionVoucherRate(request.getCommissionVoucherRate());
        plan.setVoucherMaxPerItem(request.getVoucherMaxPerItem());
        plan.setFreeshipEnabled(request.getFreeshipEnabled());
        plan.setVoucherEnabled(request.getVoucherEnabled());
        plan.setIsActive(request.getIsActive());

        SubscriptionPlan saved = planRepository.save(plan);
        log.info("Plan created successfully: {}", saved.getId());
        return toPlanDto(saved);
    }

    @Override
    @Transactional
    public SubscriptionPlanDto updatePlan(String id, UpdateSubscriptionPlanRequest request) {
        log.info("Updating plan: {}", id);
        SubscriptionPlan plan = getPlan(id);

        if (request.getName() != null)
            plan.setName(request.getName());
        if (request.getDescription() != null)
            plan.setDescription(request.getDescription());
        if (request.getSubscriptionType() != null)
            plan.setSubscriptionType(request.getSubscriptionType());
        if (request.getColorHex() != null)
            plan.setColorHex(request.getColorHex());
        if (request.getIcon() != null)
            plan.setIcon(request.getIcon());
        if (request.getDisplayOrder() != null)
            plan.setDisplayOrder(request.getDisplayOrder());
        if (request.getCommissionPaymentRate() != null)
            plan.setCommissionPaymentRate(request.getCommissionPaymentRate());
        if (request.getCommissionFixedRate() != null)
            plan.setCommissionFixedRate(request.getCommissionFixedRate());
        if (request.getCommissionFreeshipRate() != null)
            plan.setCommissionFreeshipRate(request.getCommissionFreeshipRate());
        if (request.getCommissionVoucherRate() != null)
            plan.setCommissionVoucherRate(request.getCommissionVoucherRate());
        if (request.getVoucherMaxPerItem() != null)
            plan.setVoucherMaxPerItem(request.getVoucherMaxPerItem());
        if (request.getFreeshipEnabled() != null)
            plan.setFreeshipEnabled(request.getFreeshipEnabled());
        if (request.getVoucherEnabled() != null)
            plan.setVoucherEnabled(request.getVoucherEnabled());
        if (request.getIsActive() != null)
            plan.setIsActive(request.getIsActive());

        SubscriptionPlan updated = planRepository.save(plan);
        log.info("Plan updated successfully: {}", id);
        return toPlanDto(updated);
    }

    @Override
    @Transactional
    public void deletePlan(String id) {
        log.info("Deleting plan: {}", id);
        SubscriptionPlan plan = getPlan(id);

        // Check if plan has active subscriptions
        List<ShopSubscription> activeSubscriptions = shopSubscriptionRepository
                .findByPlanAndIsActiveTrue(plan);

        if (!activeSubscriptions.isEmpty()) {
            throw new IllegalStateException("Cannot delete plan with active subscriptions");
        }

        planRepository.delete(plan);
        log.info("Plan deleted successfully: {}", id);
    }

    @Override
    @Transactional
    public void toggleActive(String id) {
        log.info("Toggling active status for plan: {}", id);
        SubscriptionPlan plan = getPlan(id);
        plan.setIsActive(!plan.getIsActive());
        planRepository.save(plan);
        log.info("Plan active status toggled to: {}", plan.getIsActive());
    }

    @Override
    @Transactional
    public void updateDisplayOrder(String id, Integer newOrder) {
        log.info("Updating display order for plan: {} to {}", id, newOrder);
        SubscriptionPlan plan = getPlan(id);
        plan.setDisplayOrder(newOrder);
        planRepository.save(plan);
    }

    // ============ PRICING MANAGEMENT ============

    @Override
    public List<SubscriptionPlanPricingDto> getPlanPricing(String planId) {
        log.info("Fetching pricing for plan: {}", planId);
        getPlan(planId); // Verify plan exists
        return pricingRepository.findAllByPlanId(planId).stream()
                .map(this::toPricingDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SubscriptionPlanPricingDto createPricing(String planId, CreatePricingRequest request) {
        log.info("Creating pricing for plan: {}", planId);
        SubscriptionPlan plan = getPlan(planId);

        SubscriptionPlanPricing pricing = new SubscriptionPlanPricing();
        pricing.setPlan(plan);
        pricing.setPlanDuration(request.getPlanDuration());
        pricing.setPrice(request.getPrice());
        pricing.setIsActive(request.getIsActive());

        SubscriptionPlanPricing saved = pricingRepository.save(pricing);
        return toPricingDto(saved);
    }

    @Override
    @Transactional
    public SubscriptionPlanPricingDto updatePricing(String pricingId, UpdatePricingRequest request) {
        log.info("Updating pricing: {}", pricingId);
        SubscriptionPlanPricing pricing = getPricing(pricingId);

        if (request.getPrice() != null)
            pricing.setPrice(request.getPrice());
        if (request.getIsActive() != null)
            pricing.setIsActive(request.getIsActive());

        SubscriptionPlanPricing updated = pricingRepository.save(pricing);
        return toPricingDto(updated);
    }

    @Override
    @Transactional
    public void deletePricing(String pricingId) {
        log.info("Deleting pricing: {}", pricingId);
        SubscriptionPlanPricing pricing = getPricing(pricingId);
        pricingRepository.delete(pricing);
    }

    // ============ FEATURE MANAGEMENT ============

    @Override
    public List<SubscriptionPlanFeatureDto> getPlanFeatures(String planId) {
        log.info("Fetching features for plan: {}", planId);
        getPlan(planId); // Verify plan exists
        return featureRepository.findAllByPlanIdOrderByDisplayOrderAsc(planId).stream()
                .map(this::toFeatureDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SubscriptionPlanFeatureDto createFeature(String planId, CreateFeatureRequest request) {
        log.info("Creating feature for plan: {}", planId);
        SubscriptionPlan plan = getPlan(planId);

        SubscriptionPlanFeature feature = new SubscriptionPlanFeature();
        feature.setPlan(plan);
        feature.setFeatureText(request.getFeatureText());
        feature.setDisplayOrder(request.getDisplayOrder());

        SubscriptionPlanFeature saved = featureRepository.save(feature);
        return toFeatureDto(saved);
    }

    @Override
    @Transactional
    public SubscriptionPlanFeatureDto updateFeature(String featureId, UpdateFeatureRequest request) {
        log.info("Updating feature: {}", featureId);
        SubscriptionPlanFeature feature = getFeature(featureId);

        if (request.getFeatureText() != null)
            feature.setFeatureText(request.getFeatureText());
        if (request.getDisplayOrder() != null)
            feature.setDisplayOrder(request.getDisplayOrder());

        SubscriptionPlanFeature updated = featureRepository.save(feature);
        return toFeatureDto(updated);
    }

    @Override
    @Transactional
    public void deleteFeature(String featureId) {
        log.info("Deleting feature: {}", featureId);
        SubscriptionPlanFeature feature = getFeature(featureId);
        featureRepository.delete(feature);
    }

    @Override
    @Transactional
    public void reorderFeatures(String planId, List<String> featureIds) {
        log.info("Reordering features for plan: {}", planId);
        for (int i = 0; i < featureIds.size(); i++) {
            SubscriptionPlanFeature feature = getFeature(featureIds.get(i));
            feature.setDisplayOrder(i);
            featureRepository.save(feature);
        }
    }

    // ============ STATISTICS ============

    @Override
    public SubscriptionStatsDto getPlanStats(String planId) {
        log.info("Fetching stats for plan: {}", planId);
        SubscriptionPlan plan = getPlan(planId);

        List<ShopSubscription> allSubs = shopSubscriptionRepository
                .findByPlan(plan);
        List<ShopSubscription> activeSubs = shopSubscriptionRepository
                .findByPlanAndIsActiveTrue(plan);

        BigDecimal totalRevenue = allSubs.stream()
                .map(ShopSubscription::getPricePaid)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return SubscriptionStatsDto.builder()
                .planId(plan.getId())
                .planName(plan.getName())
                .totalSubscriptions((long) allSubs.size())
                .activeSubscriptions((long) activeSubs.size())
                .totalRevenue(totalRevenue)
                .monthlyRevenue(BigDecimal.ZERO) // TODO: Calculate properly
                .build();
    }

    @Override
    public Page<ShopSubscriptionDto> getShopSubscriptionsByPlan(String planId, Pageable pageable) {
        log.info("Fetching shop subscriptions for plan: {}", planId);
        SubscriptionPlan plan = getPlan(planId);
        List<ShopSubscription> subscriptions = shopSubscriptionRepository
                .findByPlan(plan);

        List<ShopSubscriptionDto> dtos = subscriptions.stream()
                .map(this::toShopSubscriptionDto)
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, dtos.size());
    }

    // ============ HELPER METHODS ============

    private SubscriptionPlan getPlan(String id) {
        return planRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Plan not found with id: " + id));
    }

    private SubscriptionPlanPricing getPricing(String id) {
        return pricingRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Pricing not found with id: " + id));
    }

    private SubscriptionPlanFeature getFeature(String id) {
        return featureRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Feature not found with id: " + id));
    }

    // ============ MAPPERS ============

    private SubscriptionPlanDto toPlanDto(SubscriptionPlan plan) {
        return SubscriptionPlanDto.builder()
                .id(plan.getId())
                .code(plan.getCode())
                .name(plan.getName())
                .description(plan.getDescription())
                .subscriptionType(plan.getSubscriptionType())
                .isActive(plan.getIsActive())
                .displayOrder(plan.getDisplayOrder())
                .colorHex(plan.getColorHex())
                .icon(plan.getIcon())
                .commissionPaymentRate(plan.getCommissionPaymentRate())
                .commissionFixedRate(plan.getCommissionFixedRate())
                .commissionFreeshipRate(plan.getCommissionFreeshipRate())
                .commissionVoucherRate(plan.getCommissionVoucherRate())
                .voucherMaxPerItem(plan.getVoucherMaxPerItem())
                .freeshipEnabled(plan.getFreeshipEnabled())
                .voucherEnabled(plan.getVoucherEnabled())
                .pricing(pricingRepository.findAllByPlanId(plan.getId()).stream()
                        .map(this::toPricingDto).collect(Collectors.toList()))
                .features(featureRepository.findAllByPlanIdOrderByDisplayOrderAsc(plan.getId()).stream()
                        .map(this::toFeatureDto).collect(Collectors.toList()))
                .createdAt(plan.getCreationTimestamp())
                .updatedAt(
                        plan.getUpdateTimestamp() != null ? plan.getUpdateTimestamp()
                                : plan.getCreationTimestamp())
                .build();
    }

    private SubscriptionPlanPricingDto toPricingDto(SubscriptionPlanPricing pricing) {
        return SubscriptionPlanPricingDto.builder()
                .id(pricing.getId())
                .planId(pricing.getPlan().getId())
                .planDuration(pricing.getPlanDuration())
                .price(pricing.getPrice())
                .isActive(pricing.getIsActive())
                .build();
    }

    private SubscriptionPlanFeatureDto toFeatureDto(SubscriptionPlanFeature feature) {
        return SubscriptionPlanFeatureDto.builder()
                .id(feature.getId())
                .planId(feature.getPlan().getId())
                .featureText(feature.getFeatureText())
                .displayOrder(feature.getDisplayOrder())
                .build();
    }

    private ShopSubscriptionDto toShopSubscriptionDto(ShopSubscription subscription) {
        return ShopSubscriptionDto.builder()
                .id(subscription.getId())
                .shopOwnerId(null) // TODO: Get from subscription if needed
                .shopOwnerName(null) // TODO: Get from subscription if needed
                .planId(subscription.getPlan() != null ? subscription.getPlan().getId() : null)
                .planCode(subscription.getPlanCode())
                .subscriptionType(subscription.getSubscriptionType())
                .planDuration(subscription.getPlanDuration())
                .pricePaid(subscription.getPricePaid())
                .startDate(subscription.getStartDate())
                .endDate(subscription.getEndDate())
                .isActive(subscription.getIsActive())
                .autoRenew(subscription.getAutoRenew())
                .paymentStatus(subscription.getPaymentStatus())
                .createdAt(subscription.getCreationTimestamp())
                .build();
    }
}
