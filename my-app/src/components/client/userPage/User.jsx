import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUserRole, isAuthenticated } from "../../../api/auth.js";
import { getUser } from "../../../api/user.js";
import shopCoinAPI from "../../../api/shopCoin/shopCoinAPI.js";
import Address from "./Address.jsx";
import AccountInfo from "./AccountInfo.jsx";
import RoleRequestForm from "./RoleRequestForm.jsx";
import OrderList from "./OrderList.jsx";
import NotificationPage from "./NotificationPage.jsx";
import CoinPage from "./CoinPage.jsx";
import Loading from "../Loading.jsx";
import { fetchImageById } from "../../../api/image.js";
<<<<<<< Updated upstream
=======
import "../../../assets/admin/css/ShopCoin.css";
import "./DailyCheckIn.css";
>>>>>>> Stashed changes
import AdDisplay from "../ads/AdDisplay";

export default function User() {
    const { t } = useTranslation();
    const [, setUserInfo] = useState(null);
    const location = useLocation();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState("");
    const avatarRef = useRef("");
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("dashboard");
    const [coins, setCoins] = useState(0);
    const [hasCheckedIn, setHasCheckedIn] = useState(false);
    const [consecutiveDays, setConsecutiveDays] = useState(0);
    const [myMissions, setMyMissions] = useState([]);

    // Timer state for View Product
    const [viewProductStartTime, setViewProductStartTime] = useState(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate("/login");
        } else {
            const role = getUserRole();
            setUserInfo(role);
        }
    }, [navigate]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                setLoading(true);
                const response = await getUser();
                setUserData(response);
                // load avatar if available
                const imageId = response?.userDetails?.imageUrl || response?.imageUrl;
                if (imageId) {
                    try {
                        const resp = await fetchImageById(imageId);
                        const type = resp.headers?.["content-type"] || "image/jpeg";
                        const blob = new Blob([resp.data], { type });
                        const url = URL.createObjectURL(blob);
                        if (avatarRef.current) URL.revokeObjectURL(avatarRef.current);
                        avatarRef.current = url;
                        setAvatarUrl(url);
                    } catch (e) {
                        console.error("Failed to load avatar", e);
                        setAvatarUrl("");
                    }
                } else {
                    setAvatarUrl("");
                }

                // Fetch coin balance from backend
                try {
                    const coinResp = await shopCoinAPI.getMyShopCoins();
                    const currentCoins = coinResp?.points ?? 0;
                    setCoins(currentCoins);
                    setConsecutiveDays(coinResp?.consecutiveDays ?? 0);

                    const lastCheckInStr = coinResp?.lastCheckInDate;
                    if (lastCheckInStr) {
                        const last = new Date(lastCheckInStr).toDateString();
                        if (last === new Date().toDateString()) {
                            setHasCheckedIn(true);
                        }
                    }
                } catch (e) {
                    console.error('Failed to load coin balance', e);
                }

            } catch (error) {
                console.error("Error fetching user info:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();

        return () => {
            if (avatarRef.current) {
                URL.revokeObjectURL(avatarRef.current);
                avatarRef.current = "";
            }
        };
    }, []);

    // Listen for avatar updates from AccountInfo
    useEffect(() => {
        const handleAvatarUpdated = async (event) => {
            const detail = event?.detail || {};
            const imageId = detail.imageId;
            const urlFromDetail = detail.avatarUrl;

            // If we get an imageId, refetch to ensure fresh blob
            if (imageId) {
                try {
                    const resp = await fetchImageById(imageId);
                    const type = resp.headers?.["content-type"] || "image/jpeg";
                    const blob = new Blob([resp.data], { type });
                    const url = URL.createObjectURL(blob);
                    if (avatarRef.current) URL.revokeObjectURL(avatarRef.current);
                    avatarRef.current = url;
                    setAvatarUrl(url);
                    return;
                } catch (e) {
                    console.error("Failed to refresh avatar from imageId", e);
                }
            }

            // Fallback: use provided URL (object URL from AccountInfo)
            if (urlFromDetail) {
                if (avatarRef.current) URL.revokeObjectURL(avatarRef.current);
                avatarRef.current = urlFromDetail;
                setAvatarUrl(urlFromDetail);
            }
        };

        window.addEventListener("userAvatarUpdated", handleAvatarUpdated);
        return () => window.removeEventListener("userAvatarUpdated", handleAvatarUpdated);
    }, []);

    useEffect(() => {
        const path = location.pathname.split("/")[2];
        if (path) {
            setActiveTab(path);
        } else {
            setActiveTab("dashboard");
        }
    }, [location.pathname]);

    useEffect(() => {
        if (activeTab === 'coins') {
            fetchMyMissions();
        }
    }, [activeTab]);

    const fetchMyMissions = async () => {
        try {
            const data = await shopCoinAPI.getMyMissions();
            setMyMissions(data);
        } catch (error) {
            console.error("Failed to fetch my missions", error);
        }
    };

    const handleClaimDynamicMission = async (missionId, reward) => {
        try {
            await shopCoinAPI.claimMissionReward(missionId);
            alert(`Chúc mừng! Bạn đã nhận được ${reward} Xu!`);
            fetchMyMissions();
            // refresh coins
            const coinResp = await shopCoinAPI.getMyShopCoins();
            setCoins(coinResp?.points ?? 0);
        } catch (error) {
            console.error("Claim failed", error);
            alert(error.response?.data?.message || "Không thể nhận thưởng");
        }
    };

    // Handler for Mission Action (Start)
    const handleMissionAction = (mission) => {
        if (mission.actionCode === 'VIEW_PRODUCT') {
            // Start timer
            const now = Date.now();
            localStorage.setItem('mission_view_product_start', now);
            setViewProductStartTime(now);
            // Redirect
            window.open(mission.targetUrl, '_blank');
        } else if (mission.actionCode === 'REVIEW_ORDER') {
            // Redirect to orders
            handleTabClick('orders');
        }
    };

    // Handler for Claim Reward
    const handleClaimReward = async (mission) => {
        try {
            if (mission.actionCode === 'VIEW_PRODUCT') {
                // Check timer
                const startTime = localStorage.getItem('mission_view_product_start');
                if (!startTime) {
                    alert('Bạn chưa thực hiện nhiệm vụ xem sản phẩm!');
                    return;
                }
                const elapsed = Date.now() - parseInt(startTime);
                if (elapsed < 10000) { // 10 seconds
                    alert(`Bạn cần xem sản phẩm đủ 10 giây! (Mới xem ${(elapsed / 1000).toFixed(1)}s)`);
                    return;
                }

                // Call API
                await shopCoinAPI.performViewProductMission();
                alert('Chúc mừng! Bạn nhận được 5 Xu.');

                // Refresh coins
                const coinResp = await shopCoinAPI.getMyShopCoins();
                setCoins(coinResp?.points ?? 0);

                localStorage.removeItem('mission_view_product_start');

            } else if (mission.actionCode === 'REVIEW_ORDER') {
                // Call API (Backend validates check-today)
                // We need userId. userData might have it.
                if (!userData?.userId && !userData?.id) {
                    // Fallback check
                    console.error("User ID missing");
                    return;
                }
                const uid = userData.userId || userData.id;
                await shopCoinAPI.completeReviewMission(uid);
                alert('Chúc mừng! Bạn nhận được 10 Xu.');
                // Refresh coins
                const coinResp = await shopCoinAPI.getMyShopCoins();
                setCoins(coinResp?.points ?? 0);
            }
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Không thể nhận thưởng (Có thể bạn chưa hoàn thành hoặc đã nhận hôm nay).');
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        navigate(`/information/${tab}`);
    };

    const handleDailyCheckIn = async () => {
        if (hasCheckedIn) {
            alert("Bạn đã nhận Xu hôm nay rồi. Quay lại ngày mai!");
            return;
        }

        try {
            const result = await shopCoinAPI.dailyCheckIn();
            setCoins(result.points);
            setHasCheckedIn(true);
            setConsecutiveDays(result.consecutiveDays);
            alert(`Chúc mừng! Bạn nhận được ${result.points} Xu!`);
        } catch (error) {
            console.error('Full check-in error:', error);

            // Get error message from response
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Không thể nhận Xu ngay bây giờ';

            console.error('Error details:', {
                status: error.response?.status,
                message: errorMessage,
                data: error.response?.data
            });

            alert(errorMessage);
        }
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    return (
        <div style={{ background: '#F5F5F5', minHeight: '100vh', padding: '20px 0', width: '100%' }}>

            <div className="container" style={{ maxWidth: '1200px' }}>

                <div className="row g-3">
                    {/* Left Sidebar - Shopee Style */}
                    <div className="col-12 col-lg-3">
                        <div style={{ background: 'white', borderRadius: '4px', overflow: 'hidden' }}>
                            {/* User Profile */}
                            <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0' }}>
                                <div className="d-flex align-items-center gap-3">
                                    {avatarUrl ? (
                                        <img
                                            src={avatarUrl}
                                            alt="avatar"
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                flexShrink: 0,
                                                border: '1px solid #e5e5e5'
                                            }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '50%',
                                                background: '#E8ECEF',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}
                                        >
                                            <i className="fa fa-user" style={{ fontSize: '20px', color: '#666' }}></i>
                                        </div>
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '14px', fontWeight: 500, color: '#222', marginBottom: '4px' }}>
                                            {userData?.username || 'User'}
                                        </div>
                                        <Link
                                            to="/information/account-info"
                                            onClick={() => handleTabClick('account-info')}
                                            style={{
                                                fontSize: '12px',
                                                color: '#ee4d2d',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            {t('user.editProfile')}
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <button
                                    onClick={() => handleTabClick("notifications")}
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        border: 'none',
                                        background: activeTab === "notifications" ? '#fff5f0' : 'transparent',
                                        color: activeTab === "notifications" ? '#ee4d2d' : '#222',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <i className="fa fa-bell" style={{ width: '20px', textAlign: 'center' }}></i>
                                    {t('user.notifications')}
                                </button>

                                <button
                                    onClick={() => handleTabClick("dashboard")}
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        border: 'none',
                                        background: activeTab === "dashboard" ? '#fff5f0' : 'transparent',
                                        color: activeTab === "dashboard" ? '#ee4d2d' : '#222',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <i className="fa fa-user" style={{ width: '20px', textAlign: 'center' }}></i>
                                    {t('user.myAccount')}
                                </button>

                                {/* Sub-menu for Account */}
                                {activeTab === "dashboard" && (
                                    <div style={{ paddingLeft: '48px', background: '#fafafa' }}>
                                        <button
                                            onClick={() => handleTabClick("account-info")}
                                            style={{
                                                width: '100%',
                                                padding: '10px 0',
                                                border: 'none',
                                                background: 'transparent',
                                                color: activeTab === "account-info" ? '#ee4d2d' : '#666',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                fontSize: '13px',
                                                transition: 'color 0.2s'
                                            }}
                                        >
                                            {t('user.profile')}
                                        </button>
                                        <button
                                            onClick={() => handleTabClick("address")}
                                            style={{
                                                width: '100%',
                                                padding: '10px 0',
                                                border: 'none',
                                                background: 'transparent',
                                                color: activeTab === "address" ? '#ee4d2d' : '#666',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                fontSize: '13px',
                                                transition: 'color 0.2s'
                                            }}
                                        >
                                            {t('user.address')}
                                        </button>
                                    </div>
                                )}

                                <button
                                    onClick={() => handleTabClick("orders")}
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        border: 'none',
                                        background: activeTab === "orders" ? '#fff5f0' : 'transparent',
                                        color: activeTab === "orders" ? '#ee4d2d' : '#222',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <i className="fa fa-file-text" style={{ width: '20px', textAlign: 'center' }}></i>
                                    {t('user.myOrders')}
                                </button>


                                <button
                                    onClick={() => handleTabClick("vouchers")}
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        border: 'none',
                                        background: activeTab === "vouchers" ? '#fff5f0' : 'transparent',
                                        color: activeTab === "vouchers" ? '#ee4d2d' : '#222',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <i className="fa fa-ticket" style={{ width: '20px', textAlign: 'center' }}></i>
                                    {t('user.voucherWallet')}
                                </button>

                                <button
                                    onClick={() => handleTabClick("coins")}
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        border: 'none',
                                        background: activeTab === "coins" ? '#fff5f0' : 'transparent',
                                        color: activeTab === "coins" ? '#ee4d2d' : '#222',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <i className="fa fa-coins" style={{ width: '20px', textAlign: 'center', color: '#ffc107' }}></i>
                                    {t('user.shopeeCoins')}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-12 col-lg-9">
                        {activeTab === "orders" ? (
                            <OrderList />
                        ) : (
                            <div style={{ background: 'white', borderRadius: '4px', minHeight: '400px' }}>
                                {/* Dashboard Tab */}
                                {activeTab === "dashboard" && (
                                    <div className="p-4">
                                        <h5 style={{ color: '#222', marginBottom: '16px', fontSize: '18px' }}>{t('user.myAccount')}</h5>
                                        <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                                            {t('user.hello', { username: userData?.username || 'User' })}
                                        </p>
                                        <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                                            {t('user.accountDescription')}
                                        </p>
                                    </div>
                                )}

                                {/* Address Tab */}
                                {activeTab === "address" && (
                                    <div className="p-4">
                                        <Address />
                                    </div>
                                )}

                                {/* Account Info Tab */}
                                {activeTab === "account-info" && (
                                    <div className="p-4">
                                        <AccountInfo />
                                    </div>
                                )}

                                {/* Role Request Tab */}
                                {activeTab === "role-request" && (
                                    <div className="p-4">
                                        <RoleRequestForm />
                                    </div>
                                )}

                                {/* Notifications Tab */}
                                {activeTab === "notifications" && (
                                    <div className="p-4">
                                        <NotificationPage />
                                    </div>
                                )}

                                {/* Vouchers Tab */}
                                {activeTab === "vouchers" && (
                                    <div className="p-4">
                                        <div className="text-center py-5">
                                            <i className="fa fa-ticket" style={{ fontSize: '48px', color: '#ddd', marginBottom: '16px' }}></i>
                                            <p style={{ color: '#999', fontSize: '14px' }}>{t('user.noVouchersYet')}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Coins Tab */}
                                {activeTab === "coins" && (
<<<<<<< Updated upstream
                                    <CoinPage />
=======
                                    <div className="coin-tab-container">
                                        <div className="coin-header">
                                            <div className="coin-balance-section">
                                                <div className="coin-icon-wrapper">
                                                    <span className="coin-icon-text">S</span>
                                                </div>
                                                <div className="coin-balance-info">
                                                    <div className="d-flex align-items-baseline">
                                                        <span className="coin-amount">{coins}</span>
                                                        <div className="coin-info-text">
                                                            <div className="xu-title">
                                                                Xu đang có
                                                                <i className="fa fa-question-circle" style={{ fontSize: '12px', color: '#ccc' }}></i>
                                                            </div>
                                                            <div className="xu-expiry">{coins} Shopee Xu sẽ hết hạn vào 31-01-2026 {">"}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="get-more-xu" onClick={handleDailyCheckIn}>
                                                Nhận thêm Xu! <span style={{ fontSize: '18px' }}>›</span>
                                            </div>
                                        </div>

                                        <div className="p-3">
                                            <div className="daily-checkin-container">
                                                <div className="header-text mb-3">
                                                    <h6 style={{ fontSize: '16px', fontWeight: 'bold' }}>Điểm danh 7 ngày nhận Xu</h6>
                                                    <small className="text-muted">Nhận xu mỗi ngày, ngày 7 nhận quà lớn</small>
                                                </div>
                                                <div className="checkin-grid">
                                                    {[...Array(7)].map((_, index) => {
                                                        const day = index + 1;
                                                        // Calculate visual state
                                                        // currentConsecutiveDays is from Backend.
                                                        // if hasCheckedIn=true, consecutiveDays is TODAY's count.
                                                        // so checked days are 1 to consecutiveDays.
                                                        // if hasCheckedIn=false, consecutiveDays is YESTERDAY's count.
                                                        // so checked days are 1 to consecutiveDays. Day (consecutiveDays + 1) is Today.

                                                        let isChecked = false;
                                                        let isToday = false;

                                                        if (hasCheckedIn) {
                                                            // If checked in today, days <= consecutiveDays are checked
                                                            if (day <= consecutiveDays) isChecked = true;
                                                            if (day === consecutiveDays) isToday = true; // Highlight current streak end as 'Today' interaction
                                                        } else {
                                                            // If NOT checked in today
                                                            // Checked days are those <= consecutiveDays
                                                            if (day <= consecutiveDays) isChecked = true;
                                                            // Today is the next day
                                                            if (day === consecutiveDays + 1) isToday = true;
                                                        }

                                                        return (
                                                            <div key={day} className={`checkin-day-box ${isToday ? 'active' : ''} ${isChecked ? 'checked' : ''}`}>
                                                                <div className="bonus-tag">+{day === 7 ? '100+' : '100'}</div>
                                                                {isChecked ? (
                                                                    <div className="checked-icon-circle"><i className="fa fa-check"></i></div>
                                                                ) : (
                                                                    <div className="coin-icon-circle">S</div>
                                                                )}
                                                                <div className={`day-label ${isToday ? 'today' : ''}`}>
                                                                    {isToday ? 'Hôm nay' : `Ngày ${day}`}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <button
                                                    className="checkin-btn-large"
                                                    onClick={handleDailyCheckIn}
                                                    disabled={hasCheckedIn}
                                                >
                                                    {hasCheckedIn ? 'Quay lại ngày mai để nhận Xu' : 'Nhận ngay'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mission-section p-3">
                                            <h6 style={{ color: '#222', fontWeight: 600, marginBottom: '15px' }}>Danh sách nhiệm vụ</h6>

                                            {myMissions.length > 0 ? (
                                                myMissions.map((mission) => (
                                                    <div key={mission.id} className="mission-item" style={{
                                                        background: '#fff',
                                                        border: '1px solid #eee',
                                                        borderRadius: '8px',
                                                        padding: '15px',
                                                        marginBottom: '10px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between'
                                                    }}>
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div style={{
                                                                width: '40px', height: '40px', background: mission.completed ? '#e8f5e9' : '#fff5f0',
                                                                borderRadius: '50%', display: 'flex', alignItems: 'center',
                                                                justifyContent: 'center', color: mission.completed ? '#28a745' : '#ee4d2d'
                                                            }}>
                                                                <i className={`fa ${mission.completed ? 'fa-check' : 'fa-star'}`}></i>
                                                            </div>
                                                            <div>
                                                                <div style={{ fontWeight: 500, fontSize: '14px' }}>{mission.title}</div>
                                                                <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                                                                    {mission.description} - <span style={{ color: '#ffc107', fontWeight: 'bold' }}>{mission.rewardAmount} Xu</span>
                                                                </div>
                                                                <div className="progress mt-1" style={{ height: '4px', maxWidth: '100px' }}>
                                                                    <div className="progress-bar bg-warning" role="progressbar"
                                                                        style={{ width: `${(mission.progress / mission.targetCount) * 100}%` }}
                                                                        aria-valuenow={mission.progress} aria-valuemin="0" aria-valuemax={mission.targetCount}></div>
                                                                </div>
                                                                <small className="text-muted">{mission.progress}/{mission.targetCount}</small>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {mission.claimed ? (
                                                                <button className="btn btn-sm btn-secondary" disabled>Đã nhận</button>
                                                            ) : mission.completed ? (
                                                                <button
                                                                    onClick={() => handleClaimDynamicMission(mission.missionId, mission.rewardAmount)}
                                                                    className="btn btn-sm btn-success"
                                                                >
                                                                    Nhận thưởng
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => {
                                                                        if (mission.actionCode === 'VIEW_PRODUCT') {
                                                                            const startTime = localStorage.getItem('mission_view_product_start');
                                                                            if (startTime) {
                                                                                const elapsed = Date.now() - parseInt(startTime);
                                                                                if (elapsed >= 10000) {
                                                                                    shopCoinAPI.performViewProductMission()
                                                                                        .then(() => {
                                                                                            alert("Đã cập nhật nhiệm vụ!");
                                                                                            fetchMyMissions();
                                                                                            localStorage.removeItem('mission_view_product_start');
                                                                                        })
                                                                                        .catch(e => alert("Lỗi: " + (e.response?.data?.message || e.message)));
                                                                                    return;
                                                                                } else {
                                                                                    alert(`Hãy xem sản phẩm thêm ${(10 - elapsed / 1000).toFixed(0)}s nữa!`);
                                                                                    return;
                                                                                }
                                                                            }
                                                                            // Start timer
                                                                            localStorage.setItem('mission_view_product_start', Date.now());
                                                                            navigate('/shop');
                                                                        }
                                                                        else if (mission.actionCode === 'VIEW_CART') {
                                                                            const startTime = localStorage.getItem('mission_view_cart_start');
                                                                            if (startTime) {
                                                                                const elapsed = Date.now() - parseInt(startTime);
                                                                                if (elapsed >= 5000) {
                                                                                    shopCoinAPI.performMissionAction('VIEW_CART')
                                                                                        .then(async () => {
                                                                                            alert("Đã hoàn thành nhiệm vụ Xem Giỏ Hàng!");
                                                                                            fetchMyMissions();
                                                                                            localStorage.removeItem('mission_view_cart_start');
                                                                                            const coinResp = await shopCoinAPI.getMyShopCoins();
                                                                                            setCoins(coinResp?.points ?? 0);
                                                                                        })
                                                                                        .catch(e => alert("Lỗi: " + (e.response?.data?.message || e.message)));
                                                                                    return;
                                                                                } else {
                                                                                    alert(`Hãy xem giỏ hàng thêm ${(5 - elapsed / 1000).toFixed(0)}s nữa!`);
                                                                                    navigate('/cart');
                                                                                    return;
                                                                                }
                                                                            }
                                                                            // Start timer
                                                                            localStorage.setItem('mission_view_cart_start', Date.now());
                                                                            navigate('/cart');
                                                                        }
                                                                        else if (mission.actionCode === 'FOLLOW_SHOP') {
                                                                            alert("Hãy tìm một shop bất kỳ và nhấn 'Theo dõi' (Follow) để hoàn thành nhiệm vụ này!");
                                                                            navigate('/');
                                                                        }
                                                                        else if (mission.actionCode === 'REVIEW_ORDER') handleTabClick('orders');
                                                                        else alert("Hãy thực hiện nhiệm vụ này!");
                                                                    }}
                                                                    className="btn btn-sm btn-outline-primary"
                                                                >
                                                                    Thực hiện
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center p-3 text-muted">Chưa có nhiệm vụ nào.</div>
                                            )}
                                        </div>
                                    </div>
>>>>>>> Stashed changes
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}
