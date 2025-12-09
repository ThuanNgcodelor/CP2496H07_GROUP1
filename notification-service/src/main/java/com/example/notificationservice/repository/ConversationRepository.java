package com.example.notificationservice.repository;

import com.example.notificationservice.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, String> {

    /**
     * Tìm conversation theo client, shop, và product
     * Dùng khi client click "Chat ngay" từ 1 sản phẩm cụ thể
     */
    Optional<Conversation> findByClientIdAndShopOwnerIdAndProductId(
            String clientId,
            String shopOwnerId,
            String productId
    );

    /**
     * Tìm conversation chung (không gắn product)
     * Dùng khi chat từ trang shop chung
     */
    @Query("SELECT c FROM Conversation c WHERE c.clientId = ?1 AND c.shopOwnerId = ?2 AND c.productId IS NULL")
    Optional<Conversation> findGeneralConversation(String clientId, String shopOwnerId);

    /**
     * Lấy TẤT CẢ conversations của 1 user
     * User có thể là client hoặc shop owner
     * Sắp xếp theo thời gian cập nhật mới nhất
     */
    @Query("SELECT c FROM Conversation c WHERE c.clientId = ?1 OR c.shopOwnerId = ?1 ORDER BY c.updatedAt DESC")
    List<Conversation> findByUserId(String userId);

    /**
     * Lấy conversations giữa client và shop (TẤT CẢ, không phân biệt product)
     * VD: Xem tất cả conversations của Client A với Shop B
     */
    @Query("SELECT c FROM Conversation c WHERE (c.clientId = ?1 AND c.shopOwnerId = ?2) OR (c.clientId = ?2 AND c.shopOwnerId = ?1) ORDER BY c.updatedAt DESC")
    List<Conversation> findBetweenClientAndShop(String userId1, String userId2);

    /**
     * Đếm tổng số conversations chưa đọc
     */
    @Query("SELECT COUNT(c) FROM Conversation c WHERE (c.clientId = ?1 AND c.clientUnreadCount > 0) OR (c.shopOwnerId = ?1 AND c.shopOwnerUnreadCount > 0)")
    Long countUnreadConversations(String userId);
}
