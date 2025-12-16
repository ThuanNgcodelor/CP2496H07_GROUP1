import React from 'react';
import '../../assets/admin/css/AdminDashboard.css';

const AdminDashboard = () => {
    // Static data for dashboard
    const stats = {
        totalSales: {
            value: '$983,410',
            change: '+3.2%',
            trend: 'up',
            label: 'vs last month'
        },
        totalOrders: {
            value: '58,375',
            change: '-2.8%',
            trend: 'down',
            label: 'vs last month'
        },
        totalVisitors: {
            value: '237,782',
            change: '+9.05%',
            trend: 'up',
            label: 'vs last month'
        }
    };

    const topCategories = [
        { name: 'Electronics', value: '$1,206,000', percentage: 60, color: '#FF6B35' },
        { name: 'Fashion', value: '$906,000', percentage: 45, color: '#F7931E' },
        { name: 'Home & Kitchen', value: '$716,000', percentage: 35, color: '#FDC830' },
        { name: 'Beauty & Personal Care', value: '$506,000', percentage: 25, color: '#37B7C3' }
    ];

    const activeUsers = [
        { country: 'United States', users: 2758, percentage: 36, flag: '🇺🇸', color: '#FF6B35' },
        { country: 'United Kingdom', users: 1839, percentage: 24, flag: '🇬🇧', color: '#667eea' },
        { country: 'Indonesia', users: 1333, percentage: 17.3, flag: '🇮🇩', color: '#37B7C3' },
        { country: 'Russia', users: 1454, percentage: 19, flag: '🇷🇺', color: '#FDC830' }
    ];

    const conversionMetrics = [
        { label: 'Product Showcased', value: '25,000', change: '+3%', color: '#4ade80' },
        { label: 'Add to Cart', value: '12,000', change: '+2%', color: '#60a5fa' },
        { label: 'Proceed to Checkout', value: '8,500', change: '+1%', color: '#a78bfa' },
        { label: 'Completed Purchase', value: '6,200', change: '+2%', color: '#f472b6' },
        { label: 'Abandoned Cart', value: '3,000', change: '-1%', color: '#fb923c' }
    ];

    const recentOrders = [
        {
            id: '#10234',
            customer: 'Annette Miller',
            product: 'Wireless Headphones',
            productImage: '🎧',
            qty: 2,
            total: '$200',
            status: 'Shipped',
            statusColor: 'warning'
        },
        {
            id: '#10235',
            customer: 'Sebastian Adams',
            product: 'Running Shoes',
            productImage: '👟',
            qty: 1,
            total: '$75',
            status: 'Processing',
            statusColor: 'warning'
        },
        {
            id: '#10236',
            customer: 'Suzanne Bright',
            product: 'Smartwatch',
            productImage: '⌚',
            qty: 1,
            total: '$150',
            status: 'Delivered',
            statusColor: 'success'
        },
        {
            id: '#10237',
            customer: 'Peter Hoof',
            product: 'Coffee Maker',
            productImage: '☕',
            qty: 1,
            total: '$60',
            status: 'Pending',
            statusColor: 'danger'
        },
        {
            id: '#10238',
            customer: 'Anita Singh',
            product: 'Bluetooth Speaker',
            productImage: '🔊',
            qty: 3,
            total: '$90',
            status: 'Shipped',
            statusColor: 'warning'
        }
    ];

    const trafficSources = [
        { source: 'Direct Traffic', percentage: 40, color: '#FF6B35' },
        { source: 'Organic Search', percentage: 30, color: '#37B7C3' },
        { source: 'Social Media', percentage: 15, color: '#F7931E' },
        { source: 'Referral Traffic', percentage: 10, color: '#FDC830' },
        { source: 'Email Campaigns', percentage: 5, color: '#A78BFA' }
    ];

    const recentActivity = [
        {
            type: 'purchase',
            message: 'Maxwell Shaw purchased 2 items totaling $120',
            time: '12 min ago',
            icon: '🛍️',
            color: '#FF6B35'
        },
        {
            type: 'update',
            message: 'The stock of "Smart TV" was updated from $600 to $450',
            time: '1:32 AM',
            icon: '📦',
            color: '#667eea'
        },
        {
            type: 'review',
            message: 'Vincent Laurent left a 5-star review for "Wireless Headphones"',
            time: '2:46 AM',
            icon: '⭐',
            color: '#FDC830'
        },
        {
            type: 'stock',
            message: '"Running Shoes" stock is below 10 units',
            time: '3:12 AM',
            icon: '⚠️',
            color: '#fb923c'
        },
        {
            type: 'order',
            message: 'Damien Lyons order status changed from "Pending" to "Processing"',
            time: '7:02 AM',
            icon: '📋',
            color: '#37B7C3'
        }
    ];

    return (
        <div className="admin-dashboard">
            {/* First Row: Stats + Top Categories */}
            <div className="row-1">
                <div className="stats-section">
                    <div className="stat-card-compact">
                        <div className="stat-icon-compact stat-icon-sales">
                            <i className="fas fa-dollar-sign"></i>
                        </div>
                        <div className="stat-info-compact">
                            <span className="stat-label-compact">Total Sales</span>
                            <h2 className="stat-value-compact">{stats.totalSales.value}</h2>
                            <span className={`stat-change ${stats.totalSales.trend === 'up' ? 'positive' : 'negative'}`}>
                                {stats.totalSales.change} {stats.totalSales.label}
                            </span>
                        </div>
                    </div>

                    <div className="stat-card-compact">
                        <div className="stat-icon-compact stat-icon-orders">
                            <i className="fas fa-shopping-cart"></i>
                        </div>
                        <div className="stat-info-compact">
                            <span className="stat-label-compact">Total Orders</span>
                            <h2 className="stat-value-compact">{stats.totalOrders.value}</h2>
                            <span className={`stat-change ${stats.totalOrders.trend === 'up' ? 'positive' : 'negative'}`}>
                                {stats.totalOrders.change} {stats.totalOrders.label}
                            </span>
                        </div>
                    </div>

                    <div className="stat-card-compact">
                        <div className="stat-icon-compact stat-icon-visitors">
                            <i className="fas fa-users"></i>
                        </div>
                        <div className="stat-info-compact">
                            <span className="stat-label-compact">Total Visitors</span>
                            <h2 className="stat-value-compact">{stats.totalVisitors.value}</h2>
                            <span className={`stat-change ${stats.totalVisitors.trend === 'up' ? 'positive' : 'negative'}`}>
                                {stats.totalVisitors.change} {stats.totalVisitors.label}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="card categories-card-compact">
                    <div className="card-header">
                        <h3 className="card-title">Top Categories</h3>
                        <button className="btn-link">See All</button>
                    </div>
                    <div className="card-body">
                        <div className="category-donut-compact">
                            <div className="donut-center-compact">
                                <span className="donut-value-compact">$3,400,000</span>
                            </div>
                        </div>
                        <div className="categories-list-compact">
                            {topCategories.map((category, index) => (
                                <div key={index} className="category-item-compact">
                                    <div className="category-info">
                                        <div className="category-color" style={{ backgroundColor: category.color }}></div>
                                        <span className="category-name">{category.name}</span>
                                    </div>
                                    <span className="category-value">{category.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Second Row: Revenue Analytics + Monthly Target */}
            <div className="row-2">
                <div className="card chart-card">
                    <div className="card-header">
                        <div>
                            <h3 className="card-title">Revenue Analytics</h3>
                            <div className="chart-legend">
                                <span className="legend-item"><span className="legend-dot revenue"></span> Revenue</span>
                                <span className="legend-item"><span className="legend-dot order"></span> Order</span>
                            </div>
                        </div>
                        <button className="btn-action">Last 8 Days</button>
                    </div>
                    <div className="card-body">
                        <div className="chart-placeholder">
                            <div className="chart-stats">
                                <div className="chart-stat-item">
                                    <span className="chart-label">12 Aug</span>
                                    <span className="chart-value">$14,521</span>
                                </div>
                            </div>
                            <div className="chart-visual">
                                <svg width="100%" height="200" viewBox="0 0 600 200">
                                    {/* Revenue line (orange) */}
                                    <polyline
                                        points="0,150 100,120 200,100 300,80 400,110 500,90 600,70"
                                        fill="none"
                                        stroke="#FF6B35"
                                        strokeWidth="3"
                                    />
                                    {/* Order line (dotted) */}
                                    <polyline
                                        points="0,170 100,150 200,140 300,130 400,145 500,135 600,125"
                                        fill="none"
                                        stroke="#FDC830"
                                        strokeWidth="2"
                                        strokeDasharray="5,5"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card target-card">
                    <div className="card-header">
                        <h3 className="card-title">Monthly Target</h3>
                        <button className="btn-menu">
                            <i className="fas fa-ellipsis-v"></i>
                        </button>
                    </div>
                    <div className="card-body">
                        <div className="target-gauge">
                            <div className="gauge-circle">
                                <span className="gauge-value">85%</span>
                                <span className="gauge-label">+8.2% from last month</span>
                            </div>
                        </div>
                        <div className="target-info">
                            <p className="target-message">
                                <span className="fire-icon">🎯</span> <strong>Great Progress!</strong> We reached 85% from our monthly target, keep it up!
                            </p>
                            <div className="target-amounts">
                                <div className="amount-item">
                                    <span className="amount-label">Our Goal</span>
                                    <span className="amount-value">$600,000</span>
                                </div>
                                <div className="amount-item">
                                    <span className="amount-label">Reached</span>
                                    <span className="amount-value">$510,000</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Third Row: Active User + Conversion Rate + Traffic Sources */}
            <div className="row-3">
                <div className="card users-card-compact">
                    <div className="card-header">
                        <h3 className="card-title">Active User</h3>
                        <button className="btn-menu">
                            <i className="fas fa-ellipsis-v"></i>
                        </button>
                    </div>
                    <div className="card-body">
                        <div className="user-total">
                            <span className="user-count-large">2,758</span>
                            <span className="count-badge badge-success">+8.52%</span>
                            <span className="user-sublabel">from last week</span>
                        </div>
                        <div className="users-list-compact">
                            {activeUsers.map((user, index) => (
                                <div key={index} className="user-item-compact">
                                    <div className="user-info">
                                        <span className="user-flag">{user.flag}</span>
                                        <span className="user-country">{user.country}</span>
                                    </div>
                                    <div className="user-stats-compact">
                                        <span className="user-percentage">{user.percentage}%</span>
                                        <div className="user-progress-compact">
                                            <div
                                                className="progress-fill-compact"
                                                style={{ width: `${user.percentage}%`, backgroundColor: user.color }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="card conversion-card">
                    <div className="card-header">
                        <h3 className="card-title">Conversion Rate</h3>
                    </div>
                    <div className="card-body">
                        <div className="conversion-metrics">
                            {conversionMetrics.map((metric, index) => (
                                <div key={index} className="conversion-item">
                                    <div className="conversion-header">
                                        <span className="conversion-label">{metric.label}</span>
                                        <span className={`conversion-change ${metric.change.startsWith('+') ? 'positive' : 'negative'}`}>
                                            {metric.change}
                                        </span>
                                    </div>
                                    <h3 className="conversion-value">{metric.value}</h3>
                                </div>
                            ))}
                        </div>
                        <div className="conversion-visual">
                            {/* Visual funnel representation */}
                            <div className="funnel-bars">
                                <div className="funnel-bar" style={{ width: '100%', backgroundColor: conversionMetrics[0].color }}></div>
                                <div className="funnel-bar" style={{ width: '80%', backgroundColor: conversionMetrics[1].color }}></div>
                                <div className="funnel-bar" style={{ width: '60%', backgroundColor: conversionMetrics[2].color }}></div>
                                <div className="funnel-bar" style={{ width: '40%', backgroundColor: conversionMetrics[3].color }}></div>
                                <div className="funnel-bar" style={{ width: '20%', backgroundColor: conversionMetrics[4].color }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card traffic-card-compact">
                    <div className="card-header">
                        <h3 className="card-title">Traffic Sources</h3>
                        <button className="btn-menu">
                            <i className="fas fa-ellipsis-v"></i>
                        </button>
                    </div>
                    <div className="card-body">
                        <div className="traffic-bars-visual">
                            {trafficSources.map((source, index) => (
                                <div
                                    key={index}
                                    className="traffic-bar-item"
                                    style={{
                                        height: `${source.percentage * 2.5}px`,
                                        backgroundColor: source.color
                                    }}
                                >
                                    <span className="traffic-bar-label">{source.percentage}%</span>
                                </div>
                            ))}
                        </div>
                        <div className="traffic-list-compact">
                            {trafficSources.map((source, index) => (
                                <div key={index} className="traffic-item-compact">
                                    <div className="traffic-info">
                                        <div className="traffic-color" style={{ backgroundColor: source.color }}></div>
                                        <span className="traffic-name">{source.source}</span>
                                    </div>
                                    <span className="traffic-percentage">{source.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Fourth Row: Recent Orders + Recent Activity */}
            <div className="row-4">
                <div className="card orders-card-compact">
                    <div className="card-header">
                        <h3 className="card-title">Recent Orders</h3>
                        <button className="btn-action-sm">All Categories</button>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="orders-table-compact">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Product</th>
                                        <th>Qty</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <span className="order-id">{order.id}</span>
                                            </td>
                                            <td>
                                                <div className="customer-cell-compact">
                                                    <div className="customer-avatar-sm">
                                                        {order.customer.charAt(0)}
                                                    </div>
                                                    <span>{order.customer}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="product-cell-compact">
                                                    <span className="product-icon-sm">{order.productImage}</span>
                                                    <span>{order.product}</span>
                                                </div>
                                            </td>
                                            <td>{order.qty}</td>
                                            <td>
                                                <span className="order-total">{order.total}</span>
                                            </td>
                                            <td>
                                                <span className={`status-badge-sm status-${order.statusColor}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="card activity-card">
                    <div className="card-header">
                        <h3 className="card-title">Recent Activity</h3>
                        <button className="btn-menu">
                            <i className="fas fa-ellipsis-v"></i>
                        </button>
                    </div>
                    <div className="card-body">
                        <div className="activity-list">
                            {recentActivity.map((activity, index) => (
                                <div key={index} className="activity-item">
                                    <div className="activity-icon" style={{ backgroundColor: activity.color + '20' }}>
                                        <span>{activity.icon}</span>
                                    </div>
                                    <div className="activity-content">
                                        <p className="activity-message">{activity.message}</p>
                                        <span className="activity-time">{activity.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
