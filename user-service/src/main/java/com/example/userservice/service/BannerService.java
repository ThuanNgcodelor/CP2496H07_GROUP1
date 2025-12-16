package com.example.userservice.service;

import com.example.userservice.dto.BannerDto;
import com.example.userservice.enums.BannerPosition;
import com.example.userservice.request.CreateBannerRequest;
import com.example.userservice.request.UpdateBannerRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface BannerService {

    // CLIENT APIs
    Map<String, List<BannerDto>> getActiveBanners();

    List<BannerDto> getActiveBannersByPosition(BannerPosition position);

    void trackClick(String id);

    void trackView(String id);

    // ADMIN APIs
    List<BannerDto> getAllBanners();

    BannerDto getBannerById(String id);

    BannerDto createBanner(CreateBannerRequest request, MultipartFile image);

    BannerDto updateBanner(String id, UpdateBannerRequest request, MultipartFile image);

    void deleteBanner(String id);

    void toggleActive(String id);

    void updateDisplayOrder(String id, Integer newOrder);
}
