import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../../components/shop-owner/ShopOwnerLayout.css';

export default function WalletPage() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('unpaid'); // 'unpaid' or 'paid'
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data - sẽ thay bằng API call sau
    const [walletData, setWalletData] = useState({
        unpaidTotal: 4817233,
        paidThisWeek: 0,
        paidThisMonth: 0,
        paidTotal: 205011128
    });

    const [entries, setEntries] = useState([]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('vi-VN').format(num);
    };

    // Mock entries data
    useEffect(() => {
        // TODO: Replace with actual API call
        setEntries([
            {
                id: '1',
                orderId: '250303KSDT6YKV',
                buyerName: 'langlinhlung',
                productImage: '/placeholder-product.jpg',
                productName: 'Sản phẩm 1',
                estimatedPaymentDate: 'Doanh thu của đơn hàng sẽ được ghi nhận trong vòng 1-4 ngày kể từ khi đơn hàng cập nhật giao thành công',
                status: 'Đang chờ đơn hàng hoàn tất',
                paymentMethod: 'Chuyển khoản ngân hàng',
                unpaidAmount: 27199,
                completedAt: null
            },
            {
                id: '2',
                orderId: '250303KQXXYEBN',
                buyerName: 'thanhquhoa49',
                productImage: '/placeholder-product.jpg',
                productName: 'Sản phẩm 2',
                estimatedPaymentDate: 'Doanh thu của đơn hàng sẽ được ghi nhận trong vòng 1-4 ngày kể từ khi đơn hàng cập nhật giao thành công',
                status: 'Đang chờ đơn hàng hoàn tất',
                paymentMethod: 'Tài khoản ngân hàng đã liên kết Ví ShopeePay',
                unpaidAmount: 27199,
                completedAt: null
            }
        ]);
    }, []);

    const filteredEntries = entries.filter(entry => {
        if (searchQuery) {
            return entry.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   entry.buyerName.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
    });

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>{t('shopOwner.wallet.title')}</h1>
                        <p className="text-muted">{t('shopOwner.wallet.subtitle')}</p>
                    </div>
                </div>
            </div>

            {/* Promotional Banner */}
            <div className="card mb-4" style={{ background: 'linear-gradient(135deg, #ee4d2d 0%, #ff6b4a 100%)', border: 'none' }}>
                <div className="card-body p-4">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <h5 className="text-white mb-2">
                                <i className="fas fa-chart-line me-2"></i>
                                {t('shopOwner.wallet.promo.title')}
                            </h5>
                            <p className="text-white mb-0" style={{ fontSize: '0.9rem', opacity: 0.95 }}>
                                {t('shopOwner.wallet.promo.description')}
                            </p>
                        </div>
                        <div className="col-md-4 text-end">
                            <button className="btn btn-light btn-lg">
                                <i className="fas fa-bullhorn me-2"></i>
                                {t('shopOwner.wallet.promo.createAd')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overview Section */}
            <div className="card mb-4">
                <div className="card-header bg-white">
                    <h5 className="mb-0">{t('shopOwner.wallet.overview.title')}</h5>
                </div>
                <div className="card-body">
                    <div className="alert alert-info mb-4" style={{ fontSize: '0.9rem' }}>
                        <i className="fas fa-info-circle me-2"></i>
                        {t('shopOwner.wallet.overview.note')}
                    </div>

                    <div className="row">
                        {/* Unpaid Section */}
                        <div className="col-md-6 mb-4">
                            <div className="border rounded p-3" style={{ background: '#f8f9fa' }}>
                                <h6 className="text-muted mb-3">{t('shopOwner.wallet.overview.unpaid')}</h6>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fw-bold" style={{ fontSize: '1.1rem' }}>{t('shopOwner.wallet.overview.total')}</span>
                                    <span className="fw-bold text-danger" style={{ fontSize: '1.3rem' }}>
                                        {formatCurrency(walletData.unpaidTotal)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Paid Section */}
                        <div className="col-md-6 mb-4">
                            <div className="border rounded p-3" style={{ background: '#f8f9fa' }}>
                                <h6 className="text-muted mb-3">{t('shopOwner.wallet.overview.paid')}</h6>
                                <div className="d-flex flex-column gap-2">
                                    <div className="d-flex justify-content-between">
                                        <span>{t('shopOwner.wallet.overview.thisWeek')}</span>
                                        <span className="fw-bold">{formatCurrency(walletData.paidThisWeek)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>{t('shopOwner.wallet.overview.thisMonth')}</span>
                                        <span className="fw-bold">{formatCurrency(walletData.paidThisMonth)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between border-top pt-2 mt-2">
                                        <span className="fw-bold">{t('shopOwner.wallet.overview.total')}</span>
                                        <span className="fw-bold text-success" style={{ fontSize: '1.2rem' }}>
                                            {formatCurrency(walletData.paidTotal)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Income Report Section */}
            <div className="card mb-4">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">{t('shopOwner.wallet.incomeReport.title')}</h5>
                    <a href="#" className="text-decoration-none" style={{ color: '#ee4d2d' }}>
                        {t('shopOwner.wallet.incomeReport.viewMore')} <i className="fas fa-chevron-right"></i>
                    </a>
                </div>
                <div className="card-body">
                    <div className="list-group list-group-flush">
                        {[
                            { dateRange: '24 Th02 - 2 Th03 2025' },
                            { dateRange: '17 Th02 - 23 Th02 2025' },
                            { dateRange: '10 Th02 - 16 Th02 2025' }
                        ].map((report, idx) => (
                            <div key={idx} className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2">
                                <span>{report.dateRange}</span>
                                <button className="btn btn-sm btn-outline-primary">
                                    <i className="fas fa-download me-1"></i>
                                    {t('shopOwner.wallet.incomeReport.download')}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Details Section */}
            <div className="card">
                <div className="card-header bg-white">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">{t('shopOwner.wallet.details.title')}</h5>
                        <div className="input-group" style={{ width: '300px' }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={t('shopOwner.wallet.details.searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="btn btn-outline-secondary" type="button">
                                <i className="fas fa-search"></i>
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <ul className="nav nav-tabs border-0">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'unpaid' ? 'active' : ''}`}
                                onClick={() => setActiveTab('unpaid')}
                                style={{
                                    border: 'none',
                                    borderBottom: activeTab === 'unpaid' ? '2px solid #ee4d2d' : '2px solid transparent',
                                    color: activeTab === 'unpaid' ? '#ee4d2d' : '#666',
                                    fontWeight: activeTab === 'unpaid' ? 600 : 400
                                }}
                            >
                                {t('shopOwner.wallet.details.unpaid')}
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'paid' ? 'active' : ''}`}
                                onClick={() => setActiveTab('paid')}
                                style={{
                                    border: 'none',
                                    borderBottom: activeTab === 'paid' ? '2px solid #ee4d2d' : '2px solid transparent',
                                    color: activeTab === 'paid' ? '#ee4d2d' : '#666',
                                    fontWeight: activeTab === 'paid' ? 600 : 400
                                }}
                            >
                                {t('shopOwner.wallet.details.paid')}
                            </button>
                        </li>
                    </ul>
                </div>

                <div className="card-body">
                    {/* Table Header */}
                    <div className="row fw-bold text-muted mb-3 pb-2 border-bottom" style={{ fontSize: '0.9rem' }}>
                        <div className="col-md-3">{t('shopOwner.wallet.details.order')}</div>
                        <div className="col-md-3">{t('shopOwner.wallet.details.estimatedPaymentDate')}</div>
                        <div className="col-md-2">{t('shopOwner.wallet.details.status')}</div>
                        <div className="col-md-2">{t('shopOwner.wallet.details.paymentMethod')}</div>
                        <div className="col-md-2 text-end">
                            {activeTab === 'unpaid' 
                                ? t('shopOwner.wallet.details.unpaidAmount')
                                : t('shopOwner.wallet.details.paidAmount')
                            }
                        </div>
                    </div>

                    {/* Table Rows */}
                    {filteredEntries.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <i className="fas fa-inbox fa-3x mb-3" style={{ opacity: 0.3 }}></i>
                            <p>{t('shopOwner.wallet.details.noEntries')}</p>
                        </div>
                    ) : (
                        filteredEntries.map((entry) => (
                            <div key={entry.id} className="row align-items-center py-3 border-bottom">
                                <div className="col-md-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <img
                                            src={entry.productImage || '/placeholder-product.jpg'}
                                            alt={entry.productName}
                                            style={{
                                                width: '60px',
                                                height: '60px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                border: '1px solid #ddd'
                                            }}
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://via.placeholder.com/60x60?text=Product';
                                            }}
                                        />
                                        <div>
                                            <div className="fw-bold" style={{ fontSize: '0.9rem' }}>
                                                {entry.orderId}
                                            </div>
                                            <div className="text-muted small">
                                                {t('shopOwner.wallet.details.buyer')}: {entry.buyerName}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="text-muted small" style={{ fontSize: '0.85rem' }}>
                                        {entry.estimatedPaymentDate}
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <span className="badge bg-warning text-dark">
                                        {entry.status}
                                    </span>
                                </div>
                                <div className="col-md-2">
                                    <span className="text-muted small">{entry.paymentMethod}</span>
                                </div>
                                <div className="col-md-2 text-end">
                                    <div className="fw-bold text-danger">
                                        {formatCurrency(entry.unpaidAmount || entry.paidAmount || 0)}
                                    </div>
                                    <button className="btn btn-sm btn-link p-0 mt-1" style={{ fontSize: '0.75rem' }}>
                                        <i className="fas fa-chevron-down"></i>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

