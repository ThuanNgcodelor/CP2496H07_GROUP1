package com.example.stockservice.service;

import com.example.stockservice.client.ShopCoinClient;
import com.example.stockservice.dto.ReviewDto;
import com.example.stockservice.model.Review;
import com.example.stockservice.repository.ReviewRepository;
import com.example.stockservice.request.ReviewRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
<<<<<<< Updated upstream
    private final ShopCoinClient shopCoinClient;


=======
    private final com.example.stockservice.client.ShopCoinClient shopCoinClient;

>>>>>>> Stashed changes
    public ReviewDto createReview(String token, ReviewRequest request) {
        Review review = Review.builder()
                .userId(request.getUserId())
                .username(request.getUsername())
                .userAvatar(request.getUserAvatar())
                .productId(request.getProductId())
                .rating(request.getRating())
                .comment(request.getComment() == null ? "" : request.getComment())
                .imageIds(request.getImageIds() == null ? List.of() : request.getImageIds())
                .build();

        Review saved = reviewRepository.save(review);

<<<<<<< Updated upstream
        try {
            shopCoinClient.completeReviewMission(token, request.getUserId());
        } catch (Exception e) {
=======
        // Award ShopCoins for review (using dynamic mission system)
        try {
            shopCoinClient.completeReviewMission(token, request.getUserId());
        } catch (Exception e) {
            // Log error but don't fail the review creation
>>>>>>> Stashed changes
            System.err.println("Failed to award ShopCoins for review: " + e.getMessage());
        }

        return mapToDto(saved);
    }

    public List<ReviewDto> getReviewsByProductId(String productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ReviewDto> getReviewsByShopId(String shopId) {
        System.out.println("DEBUG: Fetching reviews for shopId: " + shopId);
        List<Review> reviews = reviewRepository.findByShopId(shopId);
        System.out.println("DEBUG: Found " + reviews.size() + " reviews for shopId: " + shopId);
        return reviews.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ReviewDto replyToReview(String reviewId, String reply) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        review.setReply(reply);
        review.setRepliedAt(LocalDateTime.now());

        Review saved = reviewRepository.save(review);
        return mapToDto(saved);
    }

    public long countReviewsByShopId(String shopId) {
        return reviewRepository.countReviewsByShopId(shopId);
    }

    @Transactional(readOnly = true)
    public boolean hasUserReviewedToday(String userId) {
        // Implement logic to check if user has a review with createdDate == Today
        // Assuming BaseEntity has createdDate or using a custom query
        // Let's use custom query in Repository or filter here if list is small (not
        // ideal).
        // Better: countByUserIdAndCreatedDateBetween
        java.time.LocalDateTime startOfDay = java.time.LocalDate.now().atStartOfDay();
        java.time.LocalDateTime endOfDay = java.time.LocalDate.now().atTime(java.time.LocalTime.MAX);
        return reviewRepository.existsByUserIdAndCreatedAtBetween(userId, startOfDay, endOfDay);
    }

    private ReviewDto mapToDto(Review review) {
        return ReviewDto.builder()
                .id(review.getId())
                .userId(review.getUserId())
                .username(review.getUsername())
                .userAvatar(review.getUserAvatar())
                .productId(review.getProductId())
                .rating(review.getRating())
                .comment(review.getComment())
                .imageIds(review.getImageIds())
                .reply(review.getReply())
                .repliedAt(review.getRepliedAt())
                .createdAt(review.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public boolean hasUserReviewedToday(String userId) {
        // Implement logic to check if user has a review with createdDate == Today
        // Assuming BaseEntity has createdDate or using a custom query
        // Let's use custom query in Repository or filter here if list is small (not
        // ideal).
        // Better: countByUserIdAndCreatedDateBetween
        java.time.LocalDateTime startOfDay = java.time.LocalDate.now().atStartOfDay();
        java.time.LocalDateTime endOfDay = java.time.LocalDate.now().atTime(java.time.LocalTime.MAX);
        return reviewRepository.existsByUserIdAndCreatedAtBetween(userId, startOfDay, endOfDay);
    }
}