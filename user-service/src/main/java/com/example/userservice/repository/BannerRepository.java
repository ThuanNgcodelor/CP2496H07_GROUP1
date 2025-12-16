package com.example.userservice.repository;

import com.example.userservice.enums.BannerPosition;
import com.example.userservice.model.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BannerRepository extends JpaRepository<Banner, String> {

    /**
     * CLIENT API: Lấy tất cả banners đang active (theo schedule + manual toggle)
     * Logic:
     * - is_active = TRUE (manual toggle bật)
     * - start_date <= NOW hoặc NULL (đã đến lịch hoặc ngay lập tức)
     * - end_date >= NOW hoặc NULL (chưa hết hạn hoặc vô thời hạn)
     */
    @Query("SELECT b FROM Banner b " +
            "WHERE b.isActive = true " +
            "AND (b.startDate IS NULL OR b.startDate <= :now) " +
            "AND (b.endDate IS NULL OR b.endDate >= :now) " +
            "ORDER BY b.position, b.displayOrder ASC")
    List<Banner> findAllActive(@Param("now") LocalDateTime now);

    /**
     * CLIENT API: Lấy banners active theo position cụ thể
     */
    @Query("SELECT b FROM Banner b " +
            "WHERE b.isActive = true " +
            "AND b.position = :position " +
            "AND (b.startDate IS NULL OR b.startDate <= :now) " +
            "AND (b.endDate IS NULL OR b.endDate >= :now) " +
            "ORDER BY b.displayOrder ASC")
    List<Banner> findActiveByPosition(
            @Param("position") BannerPosition position,
            @Param("now") LocalDateTime now);

    /**
     * ADMIN API: Lấy tất cả banners theo position (không filter active)
     */
    List<Banner> findByPositionOrderByDisplayOrderAsc(BannerPosition position);

    /**
     * ADMIN API: Lấy banners đang active (chỉ manual toggle, không check schedule)
     */
    List<Banner> findByIsActiveTrueOrderByPositionAscDisplayOrderAsc();

    /**
     * ADMIN API: Lấy banners theo status
     */
    List<Banner> findByIsActiveOrderByCreatedAtDesc(Boolean isActive);

    /**
     * ADMIN API: Tìm kiếm theo title
     */
    List<Banner> findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(String title);
}
