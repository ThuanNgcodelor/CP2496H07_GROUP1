package com.example.userservice.repository;

import com.example.userservice.model.SubscriptionPlanFeature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionPlanFeatureRepository extends JpaRepository<SubscriptionPlanFeature, String> {

    List<SubscriptionPlanFeature> findAllByPlanIdOrderByDisplayOrderAsc(String planId);

    void deleteAllByPlanId(String planId);
}
