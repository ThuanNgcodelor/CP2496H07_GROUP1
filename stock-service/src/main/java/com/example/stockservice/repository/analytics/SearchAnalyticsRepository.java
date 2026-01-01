package com.example.stockservice.repository.analytics;

import com.example.stockservice.model.analytics.SearchAnalytics;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository for SearchAnalytics entity - stores search keyword statistics
 */
@Repository
public interface SearchAnalyticsRepository extends JpaRepository<SearchAnalytics, String> {
    
    /**
     * Find analytics by keyword and date
     */
    Optional<SearchAnalytics> findByKeywordAndDate(String keyword, LocalDate date);
    
    /**
     * Find all analytics for a specific date
     */
    List<SearchAnalytics> findByDateOrderBySearchCountDesc(LocalDate date);
    
    /**
     * Find top keywords for a date range
     */
    @Query("SELECT s.keyword, SUM(s.searchCount) as total FROM search_analytics s " +
           "WHERE s.date >= :startDate AND s.date <= :endDate " +
           "GROUP BY s.keyword ORDER BY total DESC")
    List<Object[]> findTopKeywordsInDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable
    );
    
    /**
     * Find trending keywords today
     */
    @Query("SELECT s FROM search_analytics s WHERE s.date = :date ORDER BY s.searchCount DESC")
    List<SearchAnalytics> findTrendingKeywords(@Param("date") LocalDate date, Pageable pageable);
}
