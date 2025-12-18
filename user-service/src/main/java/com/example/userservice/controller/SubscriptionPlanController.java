package com.example.userservice.controller;

import com.example.userservice.dto.subscription.*;
import com.example.userservice.request.subscription.*;
import com.example.userservice.service.SubscriptionPlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/user/subscription-plan")
@RequiredArgsConstructor
public class SubscriptionPlanController {

    private final SubscriptionPlanService subscriptionPlanService;

    // ============ PUBLIC APIs ============

    /**
     * GET /v1/user/subscription-plan/active
     * Lấy tất cả plans đang active (for shop owners)
     */
    @GetMapping("/active")
    public ResponseEntity<List<SubscriptionPlanDto>> getActivePlans() {
        return ResponseEntity.ok(subscriptionPlanService.getActivePlans());
    }

    /**
     * GET /v1/user/subscription-plan/code/{code}
     * Lấy plan theo code
     */
    @GetMapping("/code/{code}")
    public ResponseEntity<SubscriptionPlanDto> getPlanByCode(@PathVariable String code) {
        return ResponseEntity.ok(subscriptionPlanService.getPlanByCode(code));
    }

    // ============ ADMIN APIs ============

    /**
     * GET /v1/user/subscription-plan
     * Lấy tất cả plans (admin only)
     */
    @GetMapping
    public ResponseEntity<List<SubscriptionPlanDto>> getAllPlans() {
        return ResponseEntity.ok(subscriptionPlanService.getAllPlans());
    }

    /**
     * GET /v1/user/subscription-plan/{id}
     * Lấy plan theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionPlanDto> getPlanById(@PathVariable String id) {
        return ResponseEntity.ok(subscriptionPlanService.getPlanById(id));
    }

    /**
     * POST /v1/user/subscription-plan
     * Tạo plan mới
     */
    @PostMapping
    public ResponseEntity<SubscriptionPlanDto> createPlan(
            @RequestBody @Valid CreateSubscriptionPlanRequest request) {
        return ResponseEntity.ok(subscriptionPlanService.createPlan(request));
    }

    /**
     * PUT /v1/user/subscription-plan/{id}
     * Cập nhật plan
     */
    @PutMapping("/{id}")
    public ResponseEntity<SubscriptionPlanDto> updatePlan(
            @PathVariable String id,
            @RequestBody @Valid UpdateSubscriptionPlanRequest request) {
        return ResponseEntity.ok(subscriptionPlanService.updatePlan(id, request));
    }

    /**
     * DELETE /v1/user/subscription-plan/{id}
     * Xóa plan
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable String id) {
        subscriptionPlanService.deletePlan(id);
        return ResponseEntity.ok().build();
    }

    /**
     * PATCH /v1/user/subscription-plan/{id}/toggle
     * Bật/tắt plan
     */
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Void> toggleActive(@PathVariable String id) {
        subscriptionPlanService.toggleActive(id);
        return ResponseEntity.ok().build();
    }

    /**
     * PATCH /v1/user/subscription-plan/{id}/order
     * Cập nhật display_order
     */
    @PatchMapping("/{id}/order")
    public ResponseEntity<Void> updateDisplayOrder(
            @PathVariable String id,
            @RequestParam Integer order) {
        subscriptionPlanService.updateDisplayOrder(id, order);
        return ResponseEntity.ok().build();
    }

    // ============ PRICING APIs ============

    /**
     * GET /v1/user/subscription-plan/{planId}/pricing
     * Lấy pricing của plan
     */
    @GetMapping("/{planId}/pricing")
    public ResponseEntity<List<SubscriptionPlanPricingDto>> getPlanPricing(@PathVariable String planId) {
        return ResponseEntity.ok(subscriptionPlanService.getPlanPricing(planId));
    }

    /**
     * POST /v1/user/subscription-plan/{planId}/pricing
     * Thêm pricing mới
     */
    @PostMapping("/{planId}/pricing")
    public ResponseEntity<SubscriptionPlanPricingDto> createPricing(
            @PathVariable String planId,
            @RequestBody @Valid CreatePricingRequest request) {
        return ResponseEntity.ok(subscriptionPlanService.createPricing(planId, request));
    }

    /**
     * PUT /v1/user/subscription-plan/pricing/{pricingId}
     * Cập nhật pricing
     */
    @PutMapping("/pricing/{pricingId}")
    public ResponseEntity<SubscriptionPlanPricingDto> updatePricing(
            @PathVariable String pricingId,
            @RequestBody @Valid UpdatePricingRequest request) {
        return ResponseEntity.ok(subscriptionPlanService.updatePricing(pricingId, request));
    }

    /**
     * DELETE /v1/user/subscription-plan/pricing/{pricingId}
     * Xóa pricing
     */
    @DeleteMapping("/pricing/{pricingId}")
    public ResponseEntity<Void> deletePricing(@PathVariable String pricingId) {
        subscriptionPlanService.deletePricing(pricingId);
        return ResponseEntity.ok().build();
    }

    // ============ FEATURE APIs ============

    /**
     * GET /v1/user/subscription-plan/{planId}/features
     * Lấy features của plan
     */
    @GetMapping("/{planId}/features")
    public ResponseEntity<List<SubscriptionPlanFeatureDto>> getPlanFeatures(@PathVariable String planId) {
        return ResponseEntity.ok(subscriptionPlanService.getPlanFeatures(planId));
    }

    /**
     * POST /v1/user/subscription-plan/{planId}/features
     * Thêm feature mới
     */
    @PostMapping("/{planId}/features")
    public ResponseEntity<SubscriptionPlanFeatureDto> createFeature(
            @PathVariable String planId,
            @RequestBody @Valid CreateFeatureRequest request) {
        return ResponseEntity.ok(subscriptionPlanService.createFeature(planId, request));
    }

    /**
     * PUT /v1/user/subscription-plan/features/{featureId}
     * Cập nhật feature
     */
    @PutMapping("/features/{featureId}")
    public ResponseEntity<SubscriptionPlanFeatureDto> updateFeature(
            @PathVariable String featureId,
            @RequestBody @Valid UpdateFeatureRequest request) {
        return ResponseEntity.ok(subscriptionPlanService.updateFeature(featureId, request));
    }

    /**
     * DELETE /v1/user/subscription-plan/features/{featureId}
     * Xóa feature
     */
    @DeleteMapping("/features/{featureId}")
    public ResponseEntity<Void> deleteFeature(@PathVariable String featureId) {
        subscriptionPlanService.deleteFeature(featureId);
        return ResponseEntity.ok().build();
    }

    /**
     * PUT /v1/user/subscription-plan/{planId}/features/reorder
     * Sắp xếp lại features
     */
    @PutMapping("/{planId}/features/reorder")
    public ResponseEntity<Void> reorderFeatures(
            @PathVariable String planId,
            @RequestBody List<String> featureIds) {
        subscriptionPlanService.reorderFeatures(planId, featureIds);
        return ResponseEntity.ok().build();
    }

    // ============ STATISTICS APIs ============

    /**
     * GET /v1/user/subscription-plan/{planId}/stats
     * Lấy thống kê plan
     */
    @GetMapping("/{planId}/stats")
    public ResponseEntity<SubscriptionStatsDto> getPlanStats(@PathVariable String planId) {
        return ResponseEntity.ok(subscriptionPlanService.getPlanStats(planId));
    }

    /**
     * GET /v1/user/subscription-plan/{planId}/subscriptions
     * Lấy danh sách shops đã subscribe plan này
     */
    @GetMapping("/{planId}/subscriptions")
    public ResponseEntity<Page<ShopSubscriptionDto>> getShopSubscriptions(
            @PathVariable String planId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(
                subscriptionPlanService.getShopSubscriptionsByPlan(planId, PageRequest.of(page, size)));
    }
}
