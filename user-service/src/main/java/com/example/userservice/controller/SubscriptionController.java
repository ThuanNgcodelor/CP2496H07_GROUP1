package com.example.userservice.controller;

import com.example.userservice.dto.ShopSubscriptionDTO;
import com.example.userservice.service.shopowner.ShopSubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/shop-subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final ShopSubscriptionService shopSubscriptionService;

    @GetMapping("/internal/shop/{shopOwnerId}")
    public ResponseEntity<ShopSubscriptionDTO> getSubscriptionByShopOwnerId(@PathVariable String shopOwnerId) {
        return ResponseEntity.ok(shopSubscriptionService.getActiveSubscription(shopOwnerId));
    }
}
