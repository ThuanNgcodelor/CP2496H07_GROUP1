package com.example.notificationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationDto {
    private String id;
    private String clientId;
    private String shopOwnerId;
    private String productId;
    private String title;
    private String lastMessageContent;
    private String lastMessageSenderId;
    private LocalDateTime lastMessageAt;
    private Integer clientUnreadCount;
    private Integer shopOwnerUnreadCount;
    private Integer unreadCount; // Unread count cho current user
    private String status;
    
    // Enriched data
    private UserDto opponent; // User đối diện (client hoặc shop owner)
    private ProductDto product; // Thông tin sản phẩm nếu có
    private List<MessageDto> messages; // Messages của conversation
}

