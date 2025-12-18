package com.example.userservice.service.shopowner;

import com.example.userservice.dto.ShopSubscriptionDTO;

public interface ShopSubscriptionService {
    ShopSubscriptionDTO getActiveSubscription(String shopOwnerId);
}
