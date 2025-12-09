package com.example.notificationservice.dto;

import com.example.notificationservice.model.Message;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto {
    private String id;
    private String conversationId;
    private String senderId;
    private String senderName;
    private Message.SenderType senderType;
    private Message.MessageType messageType;
    private String content;
    private String imageId;
    private String productId;
    private Boolean isRead;
    private LocalDateTime readAt;
    private Message.DeliveryStatus deliveryStatus;
    private LocalDateTime createdAt;
}

