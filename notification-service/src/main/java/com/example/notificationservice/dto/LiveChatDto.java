package com.example.notificationservice.dto;

import com.example.notificationservice.enums.LiveChatType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LiveChatDto {
    private String id;
    private String liveRoomId;
    private String userId;
    private String username;
    private String avatarUrl;
    private String message;
    private LiveChatType type;
    private Boolean isPinned;
    private Boolean isOwner; // True if message is from shop owner
    private String productId;
    private String productName;
    private LocalDateTime createdAt;
}
