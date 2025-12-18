package com.example.userservice.service;

import com.example.userservice.dto.subscription.*;
import com.example.userservice.request.subscription.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SubscriptionPlanService {

    // PUBLIC APIs (for shop owners)
    List<SubscriptionPlanDto> getActivePlans();

    SubscriptionPlanDto getPlanByCode(String code);

    // ADMIN APIs - Plan CRUD
    List<SubscriptionPlanDto> getAllPlans();

    SubscriptionPlanDto getPlanById(String id);

    SubscriptionPlanDto createPlan(CreateSubscriptionPlanRequest request);

    SubscriptionPlanDto updatePlan(String id, UpdateSubscriptionPlanRequest request);

    void deletePlan(String id);

    void toggleActive(String id);

    void updateDisplayOrder(String id, Integer newOrder);

    // Pricing Management
    List<SubscriptionPlanPricingDto> getPlanPricing(String planId);

    SubscriptionPlanPricingDto createPricing(String planId, CreatePricingRequest request);

    SubscriptionPlanPricingDto updatePricing(String pricingId, UpdatePricingRequest request);

    void deletePricing(String pricingId);

    // Feature Management
    List<SubscriptionPlanFeatureDto> getPlanFeatures(String planId);

    SubscriptionPlanFeatureDto createFeature(String planId, CreateFeatureRequest request);

    SubscriptionPlanFeatureDto updateFeature(String featureId, UpdateFeatureRequest request);

    void deleteFeature(String featureId);

    void reorderFeatures(String planId, List<String> featureIds);

    // Statistics
    SubscriptionStatsDto getPlanStats(String planId);

    Page<ShopSubscriptionDto> getShopSubscriptionsByPlan(String planId, Pageable pageable);
}
