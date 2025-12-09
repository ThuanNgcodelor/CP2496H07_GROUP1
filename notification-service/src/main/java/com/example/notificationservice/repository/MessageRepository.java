package com.example.notificationservice.repository;

import com.example.notificationservice.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, String> {
    
    /**
     * Lấy messages của một conversation, sắp xếp theo thời gian tạo (cũ nhất trước)
     */
    Page<Message> findByConversationIdOrderByCreatedAtAsc(String conversationId, Pageable pageable);
    
    /**
     * Lấy 20 messages gần nhất của conversation
     */
    @Query("SELECT m FROM Message m WHERE m.conversationId = :conversationId ORDER BY m.createdAt DESC")
    List<Message> findLatestMessages(@Param("conversationId") String conversationId, Pageable pageable);
    
    /**
     * Đếm số messages chưa đọc trong conversation cho một user
     */
    @Query("SELECT COUNT(m) FROM Message m WHERE m.conversationId = :conversationId " +
           "AND m.senderId != :userId AND m.isRead = false")
    Long countUnreadMessages(@Param("conversationId") String conversationId, @Param("userId") String userId);
    
    /**
     * Đánh dấu tất cả messages trong conversation là đã đọc cho một user
     */
    @Modifying
    @Query("UPDATE Message m SET m.isRead = true, m.readAt = CURRENT_TIMESTAMP, m.deliveryStatus = 'READ' " +
           "WHERE m.conversationId = :conversationId AND m.senderId != :userId AND m.isRead = false")
    void markMessagesAsRead(@Param("conversationId") String conversationId, @Param("userId") String userId);
}

