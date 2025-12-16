package com.example.userservice.service;

import com.example.userservice.client.FileStorageClient;
import com.example.userservice.dto.BannerDto;
import com.example.userservice.enums.BannerPosition;
import com.example.userservice.exception.NotFoundException;
import com.example.userservice.model.Banner;
import com.example.userservice.repository.BannerRepository;
import com.example.userservice.request.CreateBannerRequest;
import com.example.userservice.request.UpdateBannerRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BannerServiceImpl implements BannerService {

    private final BannerRepository bannerRepository;
    private final FileStorageClient fileStorageClient;

    @Override
    public Map<String, List<BannerDto>> getActiveBanners() {
        log.info("Fetching all active banners");
        List<Banner> banners = bannerRepository.findAllActive(LocalDateTime.now());

        return banners.stream()
                .map(this::toDto)
                .collect(Collectors.groupingBy(
                        banner -> banner.getPosition().name()));
    }

    @Override
    public List<BannerDto> getActiveBannersByPosition(BannerPosition position) {
        log.info("Fetching active banners for position: {}", position);
        return bannerRepository.findActiveByPosition(position, LocalDateTime.now())
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void trackClick(String id) {
        log.info("Tracking click for banner: {}", id);
        Banner banner = getBanner(id);
        banner.setClickCount(banner.getClickCount() + 1);
        bannerRepository.save(banner);
    }

    @Override
    @Transactional
    public void trackView(String id) {
        log.info("Tracking view for banner: {}", id);
        Banner banner = getBanner(id);
        banner.setViewCount(banner.getViewCount() + 1);
        bannerRepository.save(banner);
    }

    @Override
    public List<BannerDto> getAllBanners() {
        log.info("Fetching all banners");
        return bannerRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public BannerDto getBannerById(String id) {
        log.info("Fetching banner by id: {}", id);
        return toDto(getBanner(id));
    }

    @Override
    @Transactional
    public BannerDto createBanner(CreateBannerRequest request, MultipartFile image) {
        log.info("Creating new banner: {}", request.getTitle());

        // Upload image to file-storage service
        String imageId = fileStorageClient.uploadImageToFIleSystem(image).getBody();

        Banner banner = new Banner();
        banner.setId(UUID.randomUUID().toString());
        banner.setTitle(request.getTitle());
        banner.setDescription(request.getDescription());
        banner.setImageId(imageId);
        banner.setAltText(request.getAltText());
        banner.setLinkUrl(request.getLinkUrl());
        banner.setLinkType(request.getLinkType());
        banner.setTargetId(request.getTargetId());
        banner.setOpenInNewTab(request.getOpenInNewTab());
        banner.setPosition(request.getPosition());
        banner.setDisplayOrder(request.getDisplayOrder());
        banner.setStartDate(request.getStartDate());
        banner.setEndDate(request.getEndDate());
        banner.setIsActive(request.getIsActive());

        Banner saved = bannerRepository.save(banner);
        log.info("Banner created successfully: {}", saved.getId());

        return toDto(saved);
    }

    @Override
    @Transactional
    public BannerDto updateBanner(String id, UpdateBannerRequest request, MultipartFile image) {
        log.info("Updating banner: {}", id);
        Banner banner = getBanner(id);

        // Update image if provided
        if (image != null && !image.isEmpty()) {
            String newImageId = fileStorageClient.uploadImageToFIleSystem(image).getBody();
            banner.setImageId(newImageId);
        }

        // Update fields only if provided
        if (request.getTitle() != null)
            banner.setTitle(request.getTitle());
        if (request.getDescription() != null)
            banner.setDescription(request.getDescription());
        if (request.getAltText() != null)
            banner.setAltText(request.getAltText());
        if (request.getLinkUrl() != null)
            banner.setLinkUrl(request.getLinkUrl());
        if (request.getLinkType() != null)
            banner.setLinkType(request.getLinkType());
        if (request.getTargetId() != null)
            banner.setTargetId(request.getTargetId());
        if (request.getOpenInNewTab() != null)
            banner.setOpenInNewTab(request.getOpenInNewTab());
        if (request.getPosition() != null)
            banner.setPosition(request.getPosition());
        if (request.getDisplayOrder() != null)
            banner.setDisplayOrder(request.getDisplayOrder());
        if (request.getStartDate() != null)
            banner.setStartDate(request.getStartDate());
        if (request.getEndDate() != null)
            banner.setEndDate(request.getEndDate());
        if (request.getIsActive() != null)
            banner.setIsActive(request.getIsActive());

        Banner updated = bannerRepository.save(banner);
        log.info("Banner updated successfully: {}", id);

        return toDto(updated);
    }

    @Override
    @Transactional
    public void deleteBanner(String id) {
        log.info("Deleting banner: {}", id);
        Banner banner = getBanner(id);
        bannerRepository.delete(banner);
        log.info("Banner deleted successfully: {}", id);
    }

    @Override
    @Transactional
    public void toggleActive(String id) {
        log.info("Toggling active status for banner: {}", id);
        Banner banner = getBanner(id);
        banner.setIsActive(!banner.getIsActive());
        bannerRepository.save(banner);
        log.info("Banner active status toggled to: {}", banner.getIsActive());
    }

    @Override
    @Transactional
    public void updateDisplayOrder(String id, Integer newOrder) {
        log.info("Updating display order for banner: {} to {}", id, newOrder);
        Banner banner = getBanner(id);
        banner.setDisplayOrder(newOrder);
        bannerRepository.save(banner);
    }

    // Helper methods
    private Banner getBanner(String id) {
        return bannerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Banner not found with id: " + id));
    }

    private BannerDto toDto(Banner banner) {
        BannerDto dto = new BannerDto();
        dto.setId(banner.getId());
        dto.setTitle(banner.getTitle());
        dto.setDescription(banner.getDescription());
        dto.setImageId(banner.getImageId());

        // ✅ BUILD IMAGE URL from imageId
        // Trả về relative URL qua API Gateway, không phụ thuộc domain cố định
        if (banner.getImageId() != null && !banner.getImageId().isEmpty()) {
            dto.setImageUrl("/file-storage/get/" + banner.getImageId());
            log.debug("Built imageUrl for banner {}: {}", banner.getId(), dto.getImageUrl());
        } else {
            dto.setImageUrl(null);
        }

        dto.setAltText(banner.getAltText());
        dto.setLinkUrl(banner.getLinkUrl());
        dto.setLinkType(banner.getLinkType());
        dto.setTargetId(banner.getTargetId());
        dto.setOpenInNewTab(banner.getOpenInNewTab());
        dto.setPosition(banner.getPosition());
        dto.setDisplayOrder(banner.getDisplayOrder());
        dto.setStartDate(banner.getStartDate());
        dto.setEndDate(banner.getEndDate());
        dto.setIsActive(banner.getIsActive());
        dto.setClickCount(banner.getClickCount());
        dto.setViewCount(banner.getViewCount());
        dto.setCreatedBy(banner.getCreatedBy());
        dto.setCreatedAt(banner.getCreatedAt());
        dto.setUpdatedAt(banner.getUpdatedAt());
        return dto;
    }
}
