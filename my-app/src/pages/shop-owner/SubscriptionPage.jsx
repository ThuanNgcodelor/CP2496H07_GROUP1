import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../../components/shop-owner/ShopOwnerLayout.css';

export default function SubscriptionPage() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null); // 'freeship', 'voucher', 'both'
    const [planDuration, setPlanDuration] = useState('MONTHLY'); // 'MONTHLY' or 'YEARLY'

    // Mock current subscription data
    const [currentSubscription, setCurrentSubscription] = useState({
        type: null, // 'FREESHIP_XTRA', 'VOUCHER_XTRA', 'BOTH', null
        isActive: false,
        endDate: null,
        autoRenew: false
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Subscription plans data
    const plans = {
        freeship: {
            id: 'FREESHIP_XTRA',
            name: t('shopOwner.subscription.freeshipXtra.name'),
            description: t('shopOwner.subscription.freeshipXtra.description'),
            features: [
                t('shopOwner.subscription.freeshipXtra.feature1'),
                t('shopOwner.subscription.freeshipXtra.feature2'),
                t('shopOwner.subscription.freeshipXtra.feature3')
            ],
            commission: '8%',
            monthlyPrice: 500000,
            yearlyPrice: 5000000,
            icon: 'fa-truck-fast',
            color: '#4caf50'
        },
        voucher: {
            id: 'VOUCHER_XTRA',
            name: t('shopOwner.subscription.voucherXtra.name'),
            description: t('shopOwner.subscription.voucherXtra.description'),
            features: [
                t('shopOwner.subscription.voucherXtra.feature1'),
                t('shopOwner.subscription.voucherXtra.feature2'),
                t('shopOwner.subscription.voucherXtra.feature3')
            ],
            commission: '5%',
            maxCommission: '50,000đ/sản phẩm',
            monthlyPrice: 300000,
            yearlyPrice: 3000000,
            icon: 'fa-ticket-alt',
            color: '#ff9800'
        },
        both: {
            id: 'BOTH',
            name: t('shopOwner.subscription.both.name'),
            description: t('shopOwner.subscription.both.description'),
            features: [
                t('shopOwner.subscription.both.feature1'),
                t('shopOwner.subscription.both.feature2'),
                t('shopOwner.subscription.both.feature3')
            ],
            commission: '21%',
            monthlyPrice: 700000,
            yearlyPrice: 7000000,
            icon: 'fa-star',
            color: '#9c27b0',
            isPopular: true
        }
    };

    const handleSubscribe = async (planType) => {
        if (loading) return;

        setLoading(true);
        try {
            // TODO: Call API to subscribe
            console.log('Subscribing to:', planType, 'Duration:', planDuration);

            // Mock success
            setTimeout(() => {
                alert(t('shopOwner.subscription.subscribeSuccess'));
                setCurrentSubscription({
                    type: planType,
                    isActive: true,
                    endDate: new Date(Date.now() + (planDuration === 'MONTHLY' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString(),
                    autoRenew: false
                });
                setLoading(false);
            }, 1000);
        } catch (error) {
            alert(t('shopOwner.subscription.subscribeError'));
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!window.confirm(t('shopOwner.subscription.cancelConfirm'))) return;

        setLoading(true);
        try {
            // TODO: Call API to cancel
            console.log('Cancelling subscription');

            setTimeout(() => {
                alert(t('shopOwner.subscription.cancelSuccess'));
                setCurrentSubscription({
                    type: null,
                    isActive: false,
                    endDate: null,
                    autoRenew: false
                });
                setLoading(false);
            }, 1000);
        } catch (error) {
            alert(t('shopOwner.subscription.cancelError'));
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>{t('shopOwner.subscription.title')}</h1>
                        <p className="text-muted">{t('shopOwner.subscription.subtitle')}</p>
                    </div>
                </div>
            </div>

            {/* Current Subscription Status */}
            {currentSubscription.isActive && currentSubscription.type && (
                <div className="card mb-4 border-success">
                    <div className="card-header bg-success text-white">
                        <h5 className="mb-0">
                            <i className="fas fa-check-circle me-2"></i>
                            {t('shopOwner.subscription.currentSubscription')}
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col-md-8">
                                <h6 className="fw-bold mb-2">
                                    {plans[currentSubscription.type.toLowerCase()]?.name || currentSubscription.type}
                                </h6>
                                <p className="text-muted mb-2">
                                    {t('shopOwner.subscription.activeUntil')}: {formatDate(currentSubscription.endDate)}
                                </p>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={currentSubscription.autoRenew}
                                        onChange={(e) => setCurrentSubscription({
                                            ...currentSubscription,
                                            autoRenew: e.target.checked
                                        })}
                                    />
                                    <label className="form-check-label">
                                        {t('shopOwner.subscription.autoRenew')}
                                    </label>
                                </div>
                            </div>
                            <div className="col-md-4 text-end">
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={handleCancel}
                                    disabled={loading}
                                >
                                    <i className="fas fa-times me-2"></i>
                                    {t('shopOwner.subscription.cancel')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Plan Duration Selector */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="d-flex justify-content-center gap-3">
                        <button
                            className={`btn ${planDuration === 'MONTHLY' ? 'btn-danger' : 'btn-outline-secondary'}`}
                            onClick={() => setPlanDuration('MONTHLY')}
                            style={{ minWidth: '150px' }}
                        >
                            <i className="fas fa-calendar-alt me-2"></i>
                            {t('shopOwner.subscription.monthly')}
                        </button>
                        <button
                            className={`btn ${planDuration === 'YEARLY' ? 'btn-danger' : 'btn-outline-secondary'}`}
                            onClick={() => setPlanDuration('YEARLY')}
                            style={{ minWidth: '150px' }}
                        >
                            <i className="fas fa-calendar-check me-2"></i>
                            {t('shopOwner.subscription.yearly')}
                            <span className="badge bg-success ms-2">
                                {t('shopOwner.subscription.save')}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Subscription Plans */}
            <div className="row g-4">
                {/* Freeship Xtra */}
                <div className="col-md-4">
                    <div className="card h-100" style={{
                        border: selectedPlan === 'freeship' ? '2px solid ' + plans.freeship.color : '1px solid #ddd',
                        transition: 'all 0.3s'
                    }}>
                        <div className="card-header text-center" style={{ background: plans.freeship.color + '20' }}>
                            <i className={`fas ${plans.freeship.icon} fa-3x mb-3`} style={{ color: plans.freeship.color }}></i>
                            <h5 className="fw-bold">{plans.freeship.name}</h5>
                        </div>
                        <div className="card-body">
                            <p className="text-muted mb-4">{plans.freeship.description}</p>

                            <div className="mb-4">
                                <h6 className="fw-bold mb-3">{t('shopOwner.subscription.features')}</h6>
                                <ul className="list-unstyled">
                                    {plans.freeship.features.map((feature, idx) => (
                                        <li key={idx} className="mb-2">
                                            <i className="fas fa-check-circle text-success me-2"></i>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mb-4 p-3 bg-light rounded">
                                <div className="text-muted small mb-1">{t('shopOwner.subscription.commission')}</div>
                                <div className="fw-bold" style={{ color: plans.freeship.color, fontSize: '1.2rem' }}>
                                    {plans.freeship.commission}
                                </div>
                                <div className="text-muted small mt-1">{t('shopOwner.subscription.onOrderValue')}</div>
                            </div>

                            <div className="text-center mb-3">
                                <div className="h3 fw-bold text-danger">
                                    {formatCurrency(planDuration === 'MONTHLY' ? plans.freeship.monthlyPrice : plans.freeship.yearlyPrice)}
                                </div>
                                <div className="text-muted small">
                                    / {planDuration === 'MONTHLY' ? t('shopOwner.subscription.perMonth') : t('shopOwner.subscription.perYear')}
                                </div>
                            </div>

                            <button
                                className="btn btn-primary w-100"
                                onClick={() => handleSubscribe('FREESHIP_XTRA')}
                                disabled={loading || (currentSubscription.isActive && currentSubscription.type === 'FREESHIP_XTRA')}
                            >
                                {currentSubscription.isActive && currentSubscription.type === 'FREESHIP_XTRA'
                                    ? t('shopOwner.subscription.currentPlan')
                                    : t('shopOwner.subscription.subscribe')
                                }
                            </button>
                        </div>
                    </div>
                </div>

                {/* Voucher Xtra */}
                <div className="col-md-4">
                    <div className="card h-100" style={{
                        border: selectedPlan === 'voucher' ? '2px solid ' + plans.voucher.color : '1px solid #ddd',
                        transition: 'all 0.3s'
                    }}>
                        <div className="card-header text-center" style={{ background: plans.voucher.color + '20' }}>
                            <i className={`fas ${plans.voucher.icon} fa-3x mb-3`} style={{ color: plans.voucher.color }}></i>
                            <h5 className="fw-bold">{plans.voucher.name}</h5>
                        </div>
                        <div className="card-body">
                            <p className="text-muted mb-4">{plans.voucher.description}</p>

                            <div className="mb-4">
                                <h6 className="fw-bold mb-3">{t('shopOwner.subscription.features')}</h6>
                                <ul className="list-unstyled">
                                    {plans.voucher.features.map((feature, idx) => (
                                        <li key={idx} className="mb-2">
                                            <i className="fas fa-check-circle text-success me-2"></i>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mb-4 p-3 bg-light rounded">
                                <div className="text-muted small mb-1">{t('shopOwner.subscription.commission')}</div>
                                <div className="fw-bold" style={{ color: plans.voucher.color, fontSize: '1.2rem' }}>
                                    {plans.voucher.commission}
                                </div>
                                <div className="text-muted small mt-1">
                                    {t('shopOwner.subscription.maxCommission')}: {plans.voucher.maxCommission}
                                </div>
                            </div>

                            <div className="text-center mb-3">
                                <div className="h3 fw-bold text-danger">
                                    {formatCurrency(planDuration === 'MONTHLY' ? plans.voucher.monthlyPrice : plans.voucher.yearlyPrice)}
                                </div>
                                <div className="text-muted small">
                                    / {planDuration === 'MONTHLY' ? t('shopOwner.subscription.perMonth') : t('shopOwner.subscription.perYear')}
                                </div>
                            </div>

                            <button
                                className="btn btn-primary w-100"
                                onClick={() => handleSubscribe('VOUCHER_XTRA')}
                                disabled={loading || (currentSubscription.isActive && currentSubscription.type === 'VOUCHER_XTRA')}
                            >
                                {currentSubscription.isActive && currentSubscription.type === 'VOUCHER_XTRA'
                                    ? t('shopOwner.subscription.currentPlan')
                                    : t('shopOwner.subscription.subscribe')
                                }
                            </button>
                        </div>
                    </div>
                </div>

                {/* Both Plans */}
                <div className="col-md-4">
                    <div className="card h-100 position-relative" style={{
                        border: selectedPlan === 'both' ? '2px solid ' + plans.both.color : '1px solid #ddd',
                        transition: 'all 0.3s'
                    }}>
                        {plans.both.isPopular && (
                            <div className="position-absolute top-0 start-50 translate-middle">
                                <span className="badge bg-danger px-3 py-2" style={{ fontSize: '0.85rem' }}>
                                    <i className="fas fa-star me-1"></i>
                                    {t('shopOwner.subscription.popular')}
                                </span>
                            </div>
                        )}
                        <div className="card-header text-center" style={{ background: plans.both.color + '20', marginTop: plans.both.isPopular ? '20px' : '0' }}>
                            <i className={`fas ${plans.both.icon} fa-3x mb-3`} style={{ color: plans.both.color }}></i>
                            <h5 className="fw-bold">{plans.both.name}</h5>
                        </div>
                        <div className="card-body">
                            <p className="text-muted mb-4">{plans.both.description}</p>

                            <div className="mb-4">
                                <h6 className="fw-bold mb-3">{t('shopOwner.subscription.features')}</h6>
                                <ul className="list-unstyled">
                                    {plans.both.features.map((feature, idx) => (
                                        <li key={idx} className="mb-2">
                                            <i className="fas fa-check-circle text-success me-2"></i>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mb-4 p-3 bg-light rounded">
                                <div className="text-muted small mb-1">{t('shopOwner.subscription.commission')}</div>
                                <div className="fw-bold" style={{ color: plans.both.color, fontSize: '1.2rem' }}>
                                    {plans.both.commission}
                                </div>
                                <div className="text-muted small mt-1">{t('shopOwner.subscription.combinedBenefits')}</div>
                            </div>

                            <div className="text-center mb-3">
                                <div className="h3 fw-bold text-danger">
                                    {formatCurrency(planDuration === 'MONTHLY' ? plans.both.monthlyPrice : plans.both.yearlyPrice)}
                                </div>
                                <div className="text-muted small">
                                    / {planDuration === 'MONTHLY' ? t('shopOwner.subscription.perMonth') : t('shopOwner.subscription.perYear')}
                                </div>
                                {planDuration === 'YEARLY' && (
                                    <div className="text-success small mt-1">
                                        <i className="fas fa-tag me-1"></i>
                                        {t('shopOwner.subscription.yearlyDiscount')}
                                    </div>
                                )}
                            </div>

                            <button
                                className="btn btn-danger w-100"
                                onClick={() => handleSubscribe('BOTH')}
                                disabled={loading || (currentSubscription.isActive && currentSubscription.type === 'BOTH')}
                            >
                                {currentSubscription.isActive && currentSubscription.type === 'BOTH'
                                    ? t('shopOwner.subscription.currentPlan')
                                    : t('shopOwner.subscription.subscribe')
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Commission Explanation */}
            <div className="card mt-4">
                <div className="card-header bg-light">
                    <h6 className="mb-0">
                        <i className="fas fa-info-circle me-2"></i>
                        {t('shopOwner.subscription.commissionInfo.title')}
                    </h6>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <h6 className="fw-bold mb-3">{t('shopOwner.subscription.commissionInfo.baseCommission')}</h6>
                            <ul className="list-unstyled">
                                <li className="mb-2">
                                    <i className="fas fa-circle text-muted me-2" style={{ fontSize: '0.5rem' }}></i>
                                    {t('shopOwner.subscription.commissionInfo.paymentFee')}: <strong>4%</strong>
                                </li>
                                <li className="mb-2">
                                    <i className="fas fa-circle text-muted me-2" style={{ fontSize: '0.5rem' }}></i>
                                    {t('shopOwner.subscription.commissionInfo.fixedFee')}: <strong>4%</strong>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-6">
                            <h6 className="fw-bold mb-3">{t('shopOwner.subscription.commissionInfo.subscriptionFee')}</h6>
                            <ul className="list-unstyled">
                                <li className="mb-2">
                                    <i className="fas fa-circle text-muted me-2" style={{ fontSize: '0.5rem' }}></i>
                                    <strong>Freeship Xtra</strong>: 8% {t('shopOwner.subscription.commissionInfo.onOrderValue')}
                                </li>
                                <li className="mb-2">
                                    <i className="fas fa-circle text-muted me-2" style={{ fontSize: '0.5rem' }}></i>
                                    <strong>Voucher Xtra</strong>: 5% {t('shopOwner.subscription.commissionInfo.perProduct')} (max 50,000đ)
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

