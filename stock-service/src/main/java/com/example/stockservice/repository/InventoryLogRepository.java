package com.example.stockservice.repository;

import com.example.stockservice.model.InventoryLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// import java.util.List;

@Repository
public interface InventoryLogRepository extends JpaRepository<InventoryLog, String> {
    Page<InventoryLog> findByUserIdOrderByCreatedTimestampDesc(String userId, Pageable pageable);

    Page<InventoryLog> findByUserIdAndProductIdOrderByCreatedTimestampDesc(String userId, String productId,
            Pageable pageable);

    // Find logs for a specific product name (search)
    Page<InventoryLog> findByUserIdAndProductNameContainingIgnoreCaseOrderByCreatedTimestampDesc(String userId,
            String productName, Pageable pageable);
}
