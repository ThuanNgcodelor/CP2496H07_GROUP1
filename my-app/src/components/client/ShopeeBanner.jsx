import React, { useState, useEffect, useRef } from 'react';
import { getActiveBanners, trackBannerClick } from '../../api/banner';
import { fetchImageById } from '../../api/image';

export default function ShopeeBanner() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [banners, setBanners] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bannerImageUrls, setBannerImageUrls] = useState({}); // Store loaded image URLs by banner ID
    const createdUrlsRef = useRef([]); // Track created blob URLs for cleanup

    // Default fallback banners (hardcoded)
    const defaultBanners = {
        LEFT_MAIN: [
            {
                id: 'default-1',
                title: '12:12 5 DAYS LEFT',
                description: 'INTERNATIONAL WAREHOUSE FAST DELIVERY',
                imageUrl: null,
                bg: 'linear-gradient(135deg, #ff6b6b 0%, #ee4d2d 100%)',
                textColor: 'white'
            },
            {
                id: 'default-2',
                title: 'FREESHIP XTRA',
                description: 'Orders from 0₫ - Max 30k',
                imageUrl: null,
                bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                textColor: 'white'
            },
            {
                id: 'default-3',
                title: 'DISCOUNT CODE',
                description: 'Voucher 25% off',
                imageUrl: null,
                bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                textColor: 'white'
            }
        ],
        RIGHT_TOP: [
            {
                id: 'default-top',
                title: '12:12 1 TAP DOWNLOAD APP 1,000,000',
                imageUrl: null,
                bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textColor: 'white'
            }
        ],
        RIGHT_BOTTOM: [
            {
                id: 'default-bottom',
                title: '12:12 UP TO 50% OFF ON APP',
                imageUrl: null,
                bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                textColor: 'white'
            }
        ]
    };

    // Fetch banners from API
    useEffect(() => {
        fetchBanners();
        
        // Cleanup blob URLs on unmount
        return () => {
            createdUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
            createdUrlsRef.current = [];
        };
    }, []);

    const fetchBanners = async () => {
        try {
            const data = await getActiveBanners();
            // Only use database banners if at least one position has banners
            if (data && (data.LEFT_MAIN?.length > 0 || data.RIGHT_TOP?.length > 0 || data.RIGHT_BOTTOM?.length > 0)) {
                console.log('Loaded banners from database:', data);
                setBanners(data);
                // Load images for all banners
                await loadBannerImages(data);
            } else {
                console.log('No active banners in database, using defaults');
            }
        } catch (error) {
            console.error('Failed to fetch banners, using defaults:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadBannerImages = async (bannersData) => {
        // Collect all banners from all positions
        const allBanners = [
            ...(bannersData.LEFT_MAIN || []),
            ...(bannersData.RIGHT_TOP || []),
            ...(bannersData.RIGHT_BOTTOM || [])
        ];

        const imagePromises = allBanners.map(async (banner) => {
            // Priority: imageId > imageUrl
            if (banner.imageId) {
                try {
                    const response = await fetchImageById(banner.imageId);
                    const blob = new Blob([response.data], {
                        type: response.headers['content-type'] || 'image/jpeg'
                    });
                    const url = URL.createObjectURL(blob);
                    createdUrlsRef.current.push(url);
                    return { bannerId: banner.id, url };
                } catch (error) {
                    console.error(`Error loading image for banner ${banner.id}:`, error);
                    // Fallback to imageUrl if fetch fails
                    if (banner.imageUrl) {
                        return { bannerId: banner.id, url: buildImageUrl(banner.imageUrl) };
                    }
                    return { bannerId: banner.id, url: null };
                }
            } else if (banner.imageUrl) {
                // Use imageUrl as fallback
                return { bannerId: banner.id, url: buildImageUrl(banner.imageUrl) };
            }
            return { bannerId: banner.id, url: null };
        });

        const results = await Promise.all(imagePromises);
        const urlMap = {};
        results.forEach(({ bannerId, url }) => {
            if (url) {
                urlMap[bannerId] = url;
            }
        });
        setBannerImageUrls(prev => ({ ...prev, ...urlMap }));
    };

    // Helper to build full image URL from relative path or return full URL as-is
    const buildImageUrl = (imageUrl) => {
        if (!imageUrl) return null;
        // If already a full URL (starts with http:// or https://), return as-is
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            return imageUrl;
        }
        // If relative path, build full URL using API base URL
        const API_BASE_URL = import.meta.env.MODE === 'production' 
            ? '/api' 
            : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');
        // Remove leading slash if present to avoid double slashes
        const path = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
        return `${API_BASE_URL}/${path}`;
    };

    // Use database banners if available, otherwise use defaults
    const displayBanners = banners || defaultBanners;
    const mainBanners = displayBanners.LEFT_MAIN || [];
    const rightTopBanner = displayBanners.RIGHT_TOP?.[0];
    const rightBottomBanner = displayBanners.RIGHT_BOTTOM?.[0];

    // Auto-rotate carousel for main banners
    useEffect(() => {
        if (mainBanners.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % mainBanners.length);
            }, 4000);
            return () => clearInterval(interval);
        }
    }, [mainBanners.length]);

    const handleBannerClick = async (banner) => {
        if (!banner || banner.id?.startsWith('default-')) return; // Don't track default banners

        try {
            // Track click for analytics
            await trackBannerClick(banner.id);

            // Navigate if banner has a link
            if (banner.linkUrl) {
                if (banner.openInNewTab) {
                    window.open(banner.linkUrl, '_blank', 'noopener,noreferrer');
                } else {
                    window.location.href = banner.linkUrl;
                }
            }
        } catch (error) {
            console.error('Failed to track banner click:', error);
        }
    };

    const renderBanner = (banner, isMain = false) => {
        if (!banner) return null;

        // Check if we have loaded image URL for this banner
        const loadedImageUrl = bannerImageUrls[banner.id];
        const hasImage = loadedImageUrl || (banner.imageUrl && !banner.imageUrl.includes('default'));
        const imageUrl = loadedImageUrl || (banner.imageUrl ? buildImageUrl(banner.imageUrl) : null);
        const background = hasImage && imageUrl
            ? `url(${imageUrl})`
            : (banner.bg || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');

        return (
            <div
                onClick={() => handleBannerClick(banner)}
                style={{
                    height: isMain ? 'clamp(200px, 30vw, 300px)' : 'clamp(100px, 20vw, 143px)',
                    minHeight: isMain ? '200px' : '100px',
                    borderRadius: '4px',
                    background: hasImage ? '#f0f0f0' : background,
                    backgroundImage: hasImage ? background : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: banner.textColor || 'white',
                    cursor: banner.linkUrl ? 'pointer' : 'default',
                    transition: 'transform 0.2s',
                    padding: isMain ? '0' : '8px',
                    textAlign: 'center'
                }}
                onMouseEnter={(e) => banner.linkUrl && (e.currentTarget.style.transform = 'scale(1.02)')}
                onMouseLeave={(e) => banner.linkUrl && (e.currentTarget.style.transform = 'scale(1)')}
            >
                {/* Overlay for text readability on images */}
                {hasImage && (banner.title || banner.description) && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1
                    }} />
                )}

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '16px' }}>
                    {isMain ? (
                        <>
                            {banner.title && (
                                <h1 style={{
                                    fontSize: 'clamp(24px, 5vw, 48px)',
                                    fontWeight: 700,
                                    marginBottom: '12px',
                                    textShadow: hasImage ? '2px 2px 4px rgba(0,0,0,0.5)' : 'none'
                                }}>
                                    {banner.title}
                                </h1>
                            )}
                            {banner.description && (
                                <p style={{
                                    fontSize: 'clamp(16px, 3vw, 24px)',
                                    marginBottom: 0,
                                    textShadow: hasImage ? '1px 1px 2px rgba(0,0,0,0.5)' : 'none'
                                }}>
                                    {banner.description}
                                </p>
                            )}
                        </>
                    ) : (
                        banner.title && (
                            <div style={{
                                fontSize: 'clamp(14px, 2.5vw, 18px)',
                                fontWeight: 600,
                                textShadow: hasImage ? '1px 1px 2px rgba(0,0,0,0.5)' : 'none'
                            }}>
                                {banner.title}
                            </div>
                        )
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div style={{ background: '#F5F5F5', padding: '16px 0' }}>
                <div className="container" style={{ maxWidth: '1200px' }}>
                    <div className="row g-3">
                        <div className="col-12 col-lg-8">
                            <div style={{
                                height: 'clamp(200px, 30vw, 300px)',
                                borderRadius: '4px',
                                background: '#e0e0e0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-4">
                            <div className="d-flex flex-column gap-3">
                                <div style={{ height: 'clamp(100px, 20vw, 143px)', borderRadius: '4px', background: '#e0e0e0' }} />
                                <div style={{ height: 'clamp(100px, 20vw, 143px)', borderRadius: '4px', background: '#e0e0e0' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: '#F5F5F5', padding: '16px 0' }}>
            <div className="container" style={{ maxWidth: '1200px' }}>
                <div className="row g-3">
                    {/* Main Banner Carousel */}
                    <div className="col-12 col-lg-8">
                        <div style={{ position: 'relative' }}>
                            {mainBanners.length > 0 && renderBanner(mainBanners[currentIndex], true)}

                            {/* Navigation Dots */}
                            {mainBanners.length > 1 && (
                                <div
                                    className="d-flex gap-2 justify-content-center"
                                    style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 3 }}
                                >
                                    {mainBanners.map((_, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setCurrentIndex(idx)}
                                            style={{
                                                width: currentIndex === idx ? '24px' : '8px',
                                                height: '8px',
                                                borderRadius: '4px',
                                                background: currentIndex === idx ? 'white' : 'rgba(255,255,255,0.5)',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Side Banners */}
                    <div className="col-12 col-lg-4">
                        <div className="d-flex flex-column gap-3">
                            {rightTopBanner && renderBanner(rightTopBanner)}
                            {rightBottomBanner && renderBanner(rightBottomBanner)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}