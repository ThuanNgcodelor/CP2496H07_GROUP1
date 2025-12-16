import React from 'react';
import '../../../assets/admin/css/ShopStatsDashboard.css';

export default function ShopStatsDashboard({ shop }) {
    // Mock data cho biểu đồ - sẽ thay bằng API call sau
    const mockStats = {
        revenue: {
            total: shop.totalRevenue,
            trend: '+12.5%',
            monthly: [
                { month: 'T7', revenue: 15000000 },
                { month: 'T8', revenue: 18000000 },
                { month: 'T9', revenue: 22000000 },
                { month: 'T10', revenue: 20000000 },
                { month: 'T11', revenue: 25000000 },
                { month: 'T12', revenue: 25000000 }
            ]
        },
        orders: {
            total: shop.totalOrders,
            byStatus: {
                pending: 10,
                processing: 25,
                shipped: 50,
                delivered: 230,
                cancelled: 5
            }
        },
        products: {
            total: shop.totalProducts,
            active: Math.floor(shop.totalProducts * 0.95),
            inactive: Math.floor(shop.totalProducts * 0.05),
            byCategory: [
                { name: 'Electronics', count: 50, color: '#FF6B35' },
                { name: 'Fashion', count: 35, color: '#F7931E' },
                { name: 'Home & Living', count: 30, color: '#FDC830' },
                { name: 'Beauty', count: 20, color: '#37B7C3' },
                { name: 'Others', count: 15, color: '#667eea' }
            ]
        },
        categories: 5
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const maxRevenue = Math.max(...mockStats.revenue.monthly.map(m => m.revenue));

    return (
        <div className="shop-stats-dashboard">
            <div className="dashboard-header">
                <h3 className="dashboard-title">
                    <i className="fas fa-chart-line me-2"></i>
                    Thống Kê: {shop.shopName}
                </h3>
                <span className="verified-badge-large">
                    {shop.verified ? (
                        <>
                            <i className="fas fa-check-circle text-success"></i> Đã xác minh
                        </>
                    ) : (
                        <>
                            <i className="fas fa-clock text-warning"></i> Chưa xác minh
                        </>
                    )}
                </span>
            </div>

            {/* Summary Cards */}
            <div className="summary-cards">
                <div className="summary-card revenue">
                    <div className="card-icon">
                        <i className="fas fa-money-bill-wave"></i>
                    </div>
                    <div className="card-content">
                        <h4 className="card-value">{formatCurrency(mockStats.revenue.total)}</h4>
                        <p className="card-label">Tổng Doanh Thu</p>
                        <span className="card-trend positive">
                            <i className="fas fa-arrow-up"></i> {mockStats.revenue.trend}
                        </span>
                    </div>
                </div>

                <div className="summary-card orders">
                    <div className="card-icon">
                        <i className="fas fa-shopping-cart"></i>
                    </div>
                    <div className="card-content">
                        <h4 className="card-value">{mockStats.orders.total}</h4>
                        <p className="card-label">Tổng Đơn Hàng</p>
                        <span className="card-detail">
                            {mockStats.orders.byStatus.delivered} đã giao
                        </span>
                    </div>
                </div>

                <div className="summary-card products">
                    <div className="card-icon">
                        <i className="fas fa-box"></i>
                    </div>
                    <div className="card-content">
                        <h4 className="card-value">{mockStats.products.total}</h4>
                        <p className="card-label">Tổng Sản Phẩm</p>
                        <span className="card-detail">
                            {mockStats.products.active} đang bán
                        </span>
                    </div>
                </div>

                <div className="summary-card categories">
                    <div className="card-icon">
                        <i className="fas fa-tags"></i>
                    </div>
                    <div className="card-content">
                        <h4 className="card-value">{mockStats.categories}</h4>
                        <p className="card-label">Danh Mục</p>
                        <span className="card-detail">
                            {mockStats.products.byCategory.length} loại
                        </span>
                    </div>
                </div>
            </div>

            {/* Revenue Trend Chart */}
            <div className="chart-section">
                <div className="section-header">
                    <h4>Xu Hướng Doanh Thu 6 Tháng Gần Đây</h4>
                </div>
                <div className="revenue-chart">
                    <div className="chart-bars">
                        {mockStats.revenue.monthly.map((data, index) => (
                            <div key={index} className="bar-container">
                                <div className="bar-wrapper">
                                    <div
                                        className="bar"
                                        style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                                    >
                                        <span className="bar-value">{(data.revenue / 1000000).toFixed(0)}M</span>
                                    </div>
                                </div>
                                <span className="bar-label">{data.month}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="row g-3">
                {/* Products by Category */}
                <div className="col-md-6">
                    <div className="chart-section">
                        <div className="section-header">
                            <h4>Sản Phẩm Theo Danh Mục</h4>
                        </div>
                        <div className="category-chart">
                            {mockStats.products.byCategory.map((category, index) => (
                                <div key={index} className="category-item">
                                    <div className="category-info">
                                        <div
                                            className="category-color"
                                            style={{ backgroundColor: category.color }}
                                        ></div>
                                        <span className="category-name">{category.name}</span>
                                    </div>
                                    <div className="category-stats">
                                        <span className="category-count">{category.count}</span>
                                        <div className="category-bar">
                                            <div
                                                className="category-fill"
                                                style={{
                                                    width: `${(category.count / mockStats.products.total) * 100}%`,
                                                    backgroundColor: category.color
                                                }}
                                            ></div>
                                        </div>
                                        <span className="category-percent">
                                            {((category.count / mockStats.products.total) * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Order Status Distribution */}
                <div className="col-md-6">
                    <div className="chart-section">
                        <div className="section-header">
                            <h4>Phân Bố Trạng Thái Đơn Hàng</h4>
                        </div>
                        <div className="status-chart">
                            <div className="status-item">
                                <div className="status-info">
                                    <span className="status-dot pending"></span>
                                    <span className="status-name">Chờ xử lý</span>
                                </div>
                                <span className="status-count">{mockStats.orders.byStatus.pending}</span>
                            </div>
                            <div className="status-item">
                                <div className="status-info">
                                    <span className="status-dot processing"></span>
                                    <span className="status-name">Đang xử lý</span>
                                </div>
                                <span className="status-count">{mockStats.orders.byStatus.processing}</span>
                            </div>
                            <div className="status-item">
                                <div className="status-info">
                                    <span className="status-dot shipped"></span>
                                    <span className="status-name">Đang giao</span>
                                </div>
                                <span className="status-count">{mockStats.orders.byStatus.shipped}</span>
                            </div>
                            <div className="status-item">
                                <div className="status-info">
                                    <span className="status-dot delivered"></span>
                                    <span className="status-name">Đã giao</span>
                                </div>
                                <span className="status-count">{mockStats.orders.byStatus.delivered}</span>
                            </div>
                            <div className="status-item">
                                <div className="status-info">
                                    <span className="status-dot cancelled"></span>
                                    <span className="status-name">Đã hủy</span>
                                </div>
                                <span className="status-count">{mockStats.orders.byStatus.cancelled}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
