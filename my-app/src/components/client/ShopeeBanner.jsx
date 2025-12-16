import React, { useState, useEffect } from 'react';
import { getActiveBanners, trackBannerClick } from '../../api/banner';

export default function ShopeeBanner() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [banners, setBanners] = useState(null);
    const [loading, setLoading] = useState(true);

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
    }, []);

    const fetchBanners = async () => {
        try {
            const data = await getActiveBanners();
            // Only use database banners if at least one position has banners
            if (data && (data.LEFT_MAIN?.length > 0 || data.RIGHT_TOP?.length > 0 || data.RIGHT_BOTTOM?.length > 0)) {
                console.log('Loaded banners from database:', data);
                setBanners(data);
            } else {
                console.log('No active banners in database, using defaults');
            }
        } catch (error) {
            console.error('Failed to fetch banners, using defaults:', error);
        } finally {
            setLoading(false);
        }
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

        const hasImage = banner.imageUrl && !banner.imageUrl.includes('default');
        const background = hasImage
            ? `url(${banner.imageUrl})`
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
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5))',
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