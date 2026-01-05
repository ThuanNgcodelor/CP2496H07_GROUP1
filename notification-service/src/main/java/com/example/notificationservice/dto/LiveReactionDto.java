package com.example.notificationservice.dto;

import com.example.notificationservice.enums.ReactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LiveReactionDto {
    private String roomId;
    private String userId;
    private String username; // Optional, maybe just show anonymous reactions
    private String avatarUrl; // Optional
    private ReactionType type;
}
