package com.example.stockservice.repository;

import com.example.stockservice.enums.FlashSaleStatus;
import com.example.stockservice.model.FlashSaleSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlashSaleSessionRepository extends JpaRepository<FlashSaleSession, String> {
    List<FlashSaleSession> findByStatus(FlashSaleStatus status);

    @org.springframework.data.jpa.repository.Query("SELECT s FROM FlashSaleSession s WHERE " +
            "(:startTime < s.endTime AND :endTime > s.startTime)")
    List<FlashSaleSession> findOverlappingSessions(
            @org.springframework.data.repository.query.Param("startTime") java.time.LocalDateTime startTime,
            @org.springframework.data.repository.query.Param("endTime") java.time.LocalDateTime endTime);
}
