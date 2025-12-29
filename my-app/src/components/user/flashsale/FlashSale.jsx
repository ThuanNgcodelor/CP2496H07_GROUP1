import React, { useState, useEffect } from 'react';
import flashSaleAPI from '../../../api/flashSale/flashSaleAPI';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../../config/config.js'; // Ensure correct path or use relative

import Header from "../../client/Header.jsx";
import Footer from "../../client/Footer.jsx";

const FlashSale = () => {
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [products, setProducts] = useState([]);
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    // Fetch Sessions on Mount
    useEffect(() => {
        const loadSessions = async () => {
            try {
                const data = await flashSaleAPI.getPublicSessions();
                setSessions(data);

                // Auto-select the first "active" session, or the first upcoming if none active
                const now = new Date();
                const active = data.find(s => {
                    const start = new Date(s.startTime);
                    const end = new Date(s.endTime);
                    return now >= start && now <= end;
                });

                if (active) {
                    setSelectedSession(active);
                } else if (data.length > 0) {
                    // Default to first upcoming if no active (or just the first one in the list)
                    setSelectedSession(data[0]);
                }
            } catch (error) {
                console.error("Failed to load flash sale sessions");
            }
        };
        loadSessions();
    }, []);

    // Fetch Products when Session Changes
    useEffect(() => {
        if (!selectedSession) return;

        const loadProducts = async () => {
            try {
                const data = await flashSaleAPI.getPublicSessionProducts(selectedSession.id);
                setProducts(data);
            } catch (error) {
                console.error("Failed to load products");
                setProducts([]);
            }
        };
        loadProducts();
    }, [selectedSession]);

    // Countdown Timer (for Active or Upcoming)
    useEffect(() => {
        if (!selectedSession) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            let targetTime;
            const start = new Date(selectedSession.startTime).getTime();
            const end = new Date(selectedSession.endTime).getTime();

            // If session is future, count down to Start. If active, count down to End.
            if (now < start) {
                targetTime = start;
            } else {
                targetTime = end;
            }

            const distance = targetTime - now;

            if (distance < 0) {
                // If ended, maybe refresh? For now just 0
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
            } else {
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setTimeLeft({ hours, minutes, seconds });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [selectedSession]);

    // Format Time for Tab
    const formatTabTime = (isoString) => {
        const date = new Date(isoString);
        return date.getHours().toString().padStart(2, '0') + ":00";
    };

    const getTabStatus = (session) => {
        const now = new Date();
        const start = new Date(session.startTime);
        const end = new Date(session.endTime);

        if (now >= start && now <= end) return "Đang diễn ra";
        if (now < start) return "Sắp diễn ra";
        return "Đã kết thúc";
    };

    const isSessionActive = (session) => {
        const now = new Date();
        if (!session) return false;
        const start = new Date(session.startTime);
        const end = new Date(session.endTime);
        return now >= start && now <= end;
    };

    return (
        <div className="wrapper" style={{ background: '#f5f5f5', minHeight: '100vh', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
            <Header />
            <main style={{ width: '100%', overflowX: 'hidden' }}>
                <div style={{ backgroundColor: '#fff', paddingBottom: '2rem' }}>
                    {/* Top Banner Section */}
                    <div className="container mx-auto" style={{ paddingTop: '1rem', paddingBottom: '0.5rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', color: '#ee4d2d', fontSize: '1.875rem', fontWeight: '800', fontStyle: 'italic', textTransform: 'uppercase' }}>
                                    <i className="fas fa-bolt" style={{ marginRight: '0.5rem' }}></i>
                                    FLASH SALE
                                </div>

                                {/* Countdown Timer */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: '#757575', fontSize: '0.875rem', fontWeight: '500', textTransform: 'uppercase', marginRight: '4px' }}>
                                        {selectedSession && isSessionActive(selectedSession) ? "SỰ KIỆN ĐANG DIỄN RA | KẾT THÚC TRONG" : "BẮT ĐẦU SAU"}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', color: '#fff' }}>
                                        <div style={{ backgroundColor: '#000', borderRadius: '2px', padding: '2px 4px', fontSize: '0.875rem', minWidth: '24px', textAlign: 'center' }}>
                                            {String(timeLeft.hours).padStart(2, '0')}
                                        </div>
                                        <span style={{ color: '#000', fontWeight: 'bold' }}>:</span>
                                        <div style={{ backgroundColor: '#000', borderRadius: '2px', padding: '2px 4px', fontSize: '0.875rem', minWidth: '24px', textAlign: 'center' }}>
                                            {String(timeLeft.minutes).padStart(2, '0')}
                                        </div>
                                        <span style={{ color: '#000', fontWeight: 'bold' }}>:</span>
                                        <div style={{ backgroundColor: '#000', borderRadius: '2px', padding: '2px 4px', fontSize: '0.875rem', minWidth: '24px', textAlign: 'center' }}>
                                            {String(timeLeft.seconds).padStart(2, '0')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Navigation */}
                    <div style={{ backgroundColor: '#414141', position: 'sticky', top: 0, zIndex: 20 }}>
                        <div className="container mx-auto">
                            <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', justifyContent: 'center' }} className="no-scrollbar">
                                {/* Fixed "On Going" Tab */}
                                <button
                                    onClick={() => {
                                        const active = sessions.find(s => isSessionActive(s));
                                        if (active) setSelectedSession(active);
                                    }}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minWidth: '150px',
                                        padding: '0.75rem 0.5rem',
                                        cursor: 'pointer',
                                        backgroundColor: (selectedSession && isSessionActive(selectedSession)) ? '#ee4d2d' : 'transparent',
                                        color: (selectedSession && isSessionActive(selectedSession)) ? '#fff' : '#bdbdbd',
                                        border: 'none',
                                        outline: 'none',
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{ fontSize: '1.25rem', fontWeight: '700', lineHeight: 1.2 }}>
                                        Đang diễn ra
                                    </div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: '500', marginTop: '2px', textTransform: 'capitalize' }}>
                                        {sessions.some(s => isSessionActive(s)) ? "Đang bán" : "Chưa có"}
                                    </div>
                                </button>

                                {sessions.map(s => {
                                    const active = selectedSession && selectedSession.id === s.id;
                                    const status = getTabStatus(s);

                                    const startTime = new Date(s.startTime);
                                    const timeLabel = startTime.getHours().toString().padStart(2, '0') + ":00";
                                    const now = new Date();
                                    const isTomorrow = startTime.getDate() !== now.getDate();

                                    return (
                                        <button
                                            key={s.id}
                                            onClick={() => setSelectedSession(s)}
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minWidth: '150px',
                                                padding: '0.75rem 0.5rem',
                                                cursor: 'pointer',
                                                backgroundColor: active ? '#ee4d2d' : 'transparent',
                                                color: active ? '#fff' : '#bdbdbd',
                                                border: 'none',
                                                outline: 'none',
                                                position: 'relative'
                                            }}
                                        >
                                            <div style={{ fontSize: '1.25rem', fontWeight: '700', lineHeight: 1.2 }}>
                                                {timeLabel}
                                            </div>
                                            <div style={{ fontSize: '0.875rem', fontWeight: '500', marginTop: '2px', textTransform: 'capitalize' }}>
                                                {status === "Đang diễn ra" ? "Đang diễn ra" : (isTomorrow ? "Ngày mai" : "Sắp diễn ra")}
                                            </div>
                                        </button>
                                    );
                                })}
                                {sessions.length === 0 && (
                                    <div style={{ padding: '1rem 2rem', color: '#bdbdbd', width: '100%', textAlign: 'center' }}>
                                        Chưa có phiên Flash Sale nào
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="container mx-auto px-4" style={{ marginTop: '2rem', minHeight: '500px' }}>
                        {(!selectedSession || (isSessionActive(selectedSession) === false && products.length === 0)) ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 0', backgroundColor: '#fff', borderRadius: '4px' }}>
                                <div style={{ color: '#e0e0e0', fontSize: '4rem', marginBottom: '1rem' }}><i className="fas fa-shopping-bag"></i></div>
                                <p style={{ color: '#757575', fontSize: '1.125rem' }}>Chưa có Flash Sale nào đang diễn ra</p>
                                <Link to="/" style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', backgroundColor: '#ee4d2d', color: '#fff', borderRadius: '2px', textDecoration: 'none', fontWeight: '500' }}>
                                    Quay lại trang chủ
                                </Link>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '10px' }}>
                                {products.map(p => {
                                    const discount = Math.round(((p.originalPrice - p.salePrice) / p.originalPrice) * 100);
                                    const progress = Math.min((p.soldCount / p.flashSaleStock) * 100, 100);
                                    const isActive = isSessionActive(selectedSession);
                                    const isSoldOut = p.soldCount >= p.flashSaleStock;

                                    return (
                                        <Link to={`/product/${p.productId}`} key={p.id} className="group" style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#fff', borderRadius: '2px', overflow: 'hidden', position: 'relative', height: '100%', border: '1px solid transparent', transition: 'border-color 0.1s', textDecoration: 'none', pointerEvents: isActive ? 'auto' : 'none' }}
                                            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ee4d2d'}
                                            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                                        >

                                            {/* Discount Badge */}
                                            <div style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'rgba(255, 212, 36, 0.9)', color: '#ee4d2d', fontWeight: '700', padding: '4px 8px', fontSize: '0.75rem', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
                                                <span>{discount}%</span>
                                                <span style={{ color: '#fff', fontSize: '0.625rem', fontWeight: '700', textTransform: 'uppercase' }}>GIẢM</span>
                                            </div>

                                            {/* Image */}
                                            <div style={{ width: '100%', paddingTop: '100%', position: 'relative', backgroundColor: '#f5f5f5' }}>
                                                {p.productImageId ? (
                                                    <img
                                                        src={`${API_BASE_URL}/v1/file-storage/get/${p.productImageId}`}
                                                        alt={p.productName}
                                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', filter: isActive ? 'none' : 'grayscale(30%)' }}
                                                        onError={(e) => e.target.src = 'https://via.placeholder.com/300?text=No+Img'}
                                                    />
                                                ) : (
                                                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bdbdbd' }}>
                                                        <i className="fas fa-image fa-2x"></i>
                                                    </div>
                                                )}
                                                {!isActive && (
                                                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '0.75rem', textAlign: 'center', padding: '4px 0', fontWeight: 'bold' }}>
                                                        SẮP DIỄN RA
                                                    </div>
                                                )}
                                            </div>

                                            <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                                <h3 style={{ fontSize: '0.875rem', color: '#333', margin: '0 0 5px 0', lineHeight: '1.2rem', height: '2.4rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                                    {p.productName || `Sản phẩm`}
                                                </h3>

                                                <div style={{ marginTop: 'auto' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                        <div style={{ fontSize: '1rem', fontWeight: '700', color: '#ee4d2d' }}>₫{p.salePrice.toLocaleString()}</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#9e9e9e', textDecoration: 'line-through' }}>₫{p.originalPrice.toLocaleString()}</div>
                                                    </div>

                                                    {/* Button / Progress Bar */}
                                                    <div style={{ marginTop: '10px' }}>
                                                        {isActive ? (
                                                            <div style={{ position: 'relative', width: '100%', height: '16px', backgroundColor: '#ffbda6', borderRadius: '8px', overflow: 'hidden' }}>
                                                                <div style={{ width: `${progress}%`, height: '100%', backgroundColor: isSoldOut ? '#757575' : '#ee4d2d', borderRadius: '8px 0 0 8px' }}></div>
                                                                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', textShadow: '0 1px 1px rgba(0,0,0,0.2)' }}>
                                                                    {isSoldOut ? "ĐÃ HẾT HÀNG" : (
                                                                        progress > 90 ? "SẮP CHÁY HÀNG" : `ĐÃ BÁN ${p.soldCount}`
                                                                    )}
                                                                </div>
                                                                {progress > 50 && !isSoldOut && (
                                                                    <div style={{ position: 'absolute', left: '4px', top: 0, bottom: 0, display: 'flex', alignItems: 'center' }}>
                                                                        <i className="fas fa-fire" style={{ color: '#fff', fontSize: '10px' }}></i>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <button
                                                                style={{ width: '100%', backgroundColor: '#e0e0e0', color: '#757575', border: 'none', borderRadius: '2px', padding: '6px 0', fontSize: '0.875rem', fontWeight: '500', cursor: 'not-allowed' }}
                                                                disabled
                                                            >
                                                                Sắp mở bán
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default FlashSale;
