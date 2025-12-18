package com.example.userservice.repository;

import com.example.userservice.enums.PlanDuration;
import com.example.userservice.model.SubscriptionPlanPricing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionPlanPricingRepository extends JpaRepository<SubscriptionPlanPricing, String> {

    List<SubscriptionPlanPricing> findAllByPlanId(String planId);

    Optional<SubscriptionPlanPricing> findByPlanIdAndPlanDuration(String planId, PlanDuration planDuration);
}
