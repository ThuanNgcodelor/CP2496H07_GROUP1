import React from 'react';
import '../../../assets/admin/css/OverviewDashboard.css';

export default function OverviewDashboard({ shops }) {
    // Calculate overview statistics
    const totalShops = shops.length;
    const totalRevenue = shops.reduce((sum, shop) => sum + shop.totalRevenue, 0);
    const totalOrders = shops.reduce((sum, shop) => sum + shop.totalOrders, 0);
    const totalProducts = shops.reduce((sum, shop) => sum + shop.totalProducts, 0);
    const verifiedShops = shops.filter(shop => shop.verified).length;

    // Top shops by revenue
    const topShopsByRevenue = [...shops]
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 5);

    // Top shops by products
    const topShopsByProducts = [...shops]
        .sort((a, b) => b.totalProducts - a.totalProducts)
        .slice(0, 5);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const maxRevenue = Math.max(...topShopsByRevenue.map(s => s.totalRevenue));
    const maxProducts = Math.max(...topShopsByProducts.map(s => s.totalProducts));

    return (
        <div className="overview-dashboard">
            <div className="dashboard-header">
                <h3 className="dashboard-title">
                    <i className="fas fa-chart-pie me-2"></i>
                    Tổng Quan Hệ Thống
                </h3>
                <p className="dashboard-subtitle">Thống kê chung của tất cả shop owners</p>
            </div>

            {/* System Summary Cards */}
            <div className="overview-summary">
                <div className="overview-card shops">
                    <div className="card-icon">
                        <i className="fas fa-store"></i>
                    </div>
                    <div className="card-content">
                        <h4 className="card-value">{totalShops}</h4>
                        <p className="card-label">Tổng Số Shop</p>
                        <span className="card-detail">
                            {verifiedShops} đã xác minh
                        </span>
                    </div>
                </div>

                <div className="overview-card revenue">
                    <div className="card-icon">
                        <i className="fas fa-money-bill-wave"></i>
                    </div>
                    <div className="card-content">
                        <h4 className="card-value">{formatCurrency(totalRevenue)}</h4>
                        <p className="card-label">Tổng Doanh Thu</p>
                        <span className="card-detail">
                            Từ tất cả shop
                        </span>
                    </div>
                </div>

                <div className="overview-card orders">
                    <div className="card-icon">
                        <i className="fas fa-shopping-cart"></i>
                    </div>
                    <div className="card-content">
                        <h4 className="card-value">{totalOrders.toLocaleString()}</h4>
                        <p className="card-label">Tổng Đơn Hàng</p>
                        <span className="card-detail">
                            Trung bình {Math.floor(totalOrders / totalShops)}/shop
                        </span>
                    </div>
                </div>

                <div className="overview-card products">
                    <div className="card-icon">
                        <i className="fas fa-box"></i>
                    </div>
                    <div className="card-content">
                        <h4 className="card-value">{totalProducts.toLocaleString()}</h4>
                        <p className="card-label">Tổng Sản Phẩm</p>
                        <span className="card-detail">
                            Trung bình {Math.floor(totalProducts / totalShops)}/shop
                        </span>
                    </div>
                </div>
            </div>

            {/* Revenue Comparison Chart */}
            <div className="chart-section">
                <div className="section-header">
                    <h4>
                        <i className="fas fa-trophy me-2"></i>
                        Top 5 Shop Theo Doanh Thu
                    </h4>
                </div>
                <div className="revenue-comparison-chart">
                    {topShopsByRevenue.map((shop, index) => (
                        <div key={shop.id} className="shop-revenue-bar">
                            <div className="shop-rank">#{index + 1}</div>
                            <div className="shop-details">
                                <div className="shop-name-row">
                                    <span className="shop-name">{shop.shopName}</span>
                                    {shop.verified && <i className="fas fa-check-circle verified-icon"></i>}
                                </div>
                                <div className="revenue-bar-container">
                                    <div
                                        className="revenue-bar-fill"
                                        style={{ width: `${(shop.totalRevenue / maxRevenue) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="shop-stats-row">
                                    <span className="revenue-amount">{formatCurrency(shop.totalRevenue)}</span>
                                    <span className="order-count">{shop.totalOrders} đơn</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Product Distribution Chart */}
            <div className="chart-section">
                <div className="section-header">
                    <h4>
                        <i className="fas fa-boxes me-2"></i>
                        Top 5 Shop Theo Số Lượng Sản Phẩm
                    </h4>
                </div>
                <div className="product-distribution-chart">
                    {topShopsByProducts.map((shop, index) => (
                        <div key={shop.id} className="shop-product-bar">
                            <div className="shop-rank">#{index + 1}</div>
                            <div className="shop-details">
                                <div className="shop-name-row">
                                    <span className="shop-name">{shop.shopName}</span>
                                    {shop.verified && <i className="fas fa-check-circle verified-icon"></i>}
                                </div>
                                <div className="product-bar-container">
                                    <div
                                        className="product-bar-fill"
                                        style={{ width: `${(shop.totalProducts / maxProducts) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="shop-stats-row">
                                    <span className="product-count">{shop.totalProducts} sản phẩm</span>
                                    <span className="owner-name">{shop.ownerName}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="quick-stats-grid">
                <div className="stat-box">
                    <div className="stat-icon">
                        <i className="fas fa-percentage"></i>
                    </div>
                    <div className="stat-info">
                        <h5>{((verifiedShops / totalShops) * 100).toFixed(1)}%</h5>
                        <p>Tỷ Lệ Xác Minh</p>
                    </div>
                </div>

                <div className="stat-box">
                    <div className="stat-icon">
                        <i className="fas fa-chart-line"></i>
                    </div>
                    <div className="stat-info">
                        <h5>{formatCurrency(totalRevenue / totalShops)}</h5>
                        <p>Doanh Thu TB/Shop</p>
                    </div>
                </div>

                <div className="stat-box">
                    <div className="stat-icon">
                        <i className="fas fa-box-open"></i>
                    </div>
                    <div className="stat-info">
                        <h5>{Math.floor(totalProducts / totalShops)}</h5>
                        <p>Sản Phẩm TB/Shop</p>
                    </div>
                </div>

                <div className="stat-box">
                    <div className="stat-icon">
                        <i className="fas fa-receipt"></i>
                    </div>
                    <div className="stat-info">
                        <h5>{Math.floor(totalOrders / totalShops)}</h5>
                        <p>Đơn Hàng TB/Shop</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
