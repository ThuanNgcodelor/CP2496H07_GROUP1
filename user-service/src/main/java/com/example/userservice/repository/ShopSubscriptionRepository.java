package com.example.userservice.repository;

import com.example.userservice.enums.SubscriptionType;
import com.example.userservice.model.ShopSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShopSubscriptionRepository extends JpaRepository<ShopSubscription, String> {
    Optional<ShopSubscription> findByShopOwnerIdAndIsActiveTrue(String shopOwnerId);
    List<ShopSubscription> findByShopOwnerIdOrderByCreatedAtDesc(String shopOwnerId);
    List<ShopSubscription> findByIsActiveTrueAndEndDateBefore(LocalDateTime date);
    List<ShopSubscription> findBySubscriptionTypeAndIsActiveTrue(SubscriptionType subscriptionType);
}

