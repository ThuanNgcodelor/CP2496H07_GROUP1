package com.example.userservice.repository;

import com.example.userservice.enums.SubscriptionType;
import com.example.userservice.model.SubscriptionPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, String> {

    Optional<SubscriptionPlan> findByCode(String code);

    List<SubscriptionPlan> findAllByIsActiveTrue();

    List<SubscriptionPlan> findAllBySubscriptionType(SubscriptionType subscriptionType);

    @Query("SELECT sp FROM SubscriptionPlan sp ORDER BY sp.displayOrder ASC")
    List<SubscriptionPlan> findAllOrderByDisplayOrder();

    boolean existsByCode(String code);
}
