package com.example.notificationservice.model;

import com.example.notificationservice.enums.ConversationStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "conversations",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "unique_conversation_per_product",
                        columnNames = {"client_id", "shop_owner_id", "product_id"}
                )
        }
)
@Data
public class Conversation {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private String id;

    @Column(name = "client_id", nullable = false, length = 255)
    private String clientId;

    @Column(name = "shop_owner_id", nullable = false, length = 255)
    private String shopOwnerId;

    @Column(name = "product_id", length = 255)
    private String productId; // NULL được phép (cho conversation chung)

    @Column(name = "title", length = 500)
    private String title; // "Hỏi về iPhone 15 Pro Max"

    @Column(name = "last_message_content", columnDefinition = "TEXT")
    private String lastMessageContent;

    @Column(name = "last_message_sender_id", length = 255)
    private String lastMessageSenderId;

    @Column(name = "last_message_at")
    private LocalDateTime lastMessageAt;

    @Column(name = "client_unread_count")
    private Integer clientUnreadCount = 0;

    @Column(name = "shop_owner_unread_count")
    private Integer shopOwnerUnreadCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConversationStatus status = ConversationStatus.ACTIVE;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (id == null) {
            id = java.util.UUID.randomUUID().toString();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}