import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getActivePlans, getMySubscription, subscribeToPlan } from '../../api/subscription';
import { getShopOwnerInfo } from '../../api/user';
import '../../components/shop-owner/ShopOwnerLayout.css';

export default function SubscriptionPage() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [shopOwnerId, setShopOwnerId] = useState(null);
    const [plans, setPlans] = useState([]);
    const [planDuration, setPlanDuration] = useState('MONTHLY'); // 'MONTHLY' or 'YEARLY'

    // Current subscription data
    const [currentSubscription, setCurrentSubscription] = useState({
        planId: null,
        type: null,
        isActive: false,
        endDate: null,
        autoRenew: false
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Get Shop Info
            const shopInfo = await getShopOwnerInfo();
            // Assuming shopInfo.id or shopInfo.userId is the ID we need. 
            // Usually shop_owners table PK is user_id.
            const id = shopInfo.userId || shopInfo.id;
            setShopOwnerId(id);

            if (id) {
                // 2. Get Data in parallel
                const [plansBox, mySub] = await Promise.all([
                    getActivePlans(),
                    getMySubscription(id).catch(() => null) // Ignore error (e.g. 404/null)
                ]);

                // 3. Process Plans
                const formattedPlans = plansBox.map(p => {
                    const monthly = p.pricing?.find(pr => pr.planDuration === 'MONTHLY')?.price || 0;
                    const yearly = p.pricing?.find(pr => pr.planDuration === 'YEARLY')?.price || 0;

                    return {
                        id: p.id,
                        code: p.code, // FREESHIP_XTRA, etc.
                        name: p.name,
                        description: p.description,
                        features: p.features?.map(f => f.featureText) || [],
                        // Map commission info for display
                        commission: (p.commissionPaymentRate * 100 + p.commissionFixedRate * 100) + '% + ' +
                            (p.commissionFreeshipRate > 0 ? (p.commissionFreeshipRate * 100) + '% ' : '') +
                            (p.commissionVoucherRate > 0 ? (p.commissionVoucherRate * 100) + '%' : ''),
                        monthlyPrice: monthly,
                        yearlyPrice: yearly,
                        icon: p.icon || 'fa-star', // Fallback icon
                        color: p.colorHex || '#4caf50',
                        isPopular: p.code === 'BOTH' // Simple heuristic
                    };
                });

                // Sort to ensure meaningful order (e.g. Freeship, Voucher, Both)
                // Using displayOrder from backend is better if available, but for now simple sort
                setPlans(formattedPlans.sort((a, b) => a.monthlyPrice - b.monthlyPrice));

                // 4. Process Subscription
                if (mySub && mySub.isActive) {
                    setCurrentSubscription({
                        planId: plansBox.find(p => p.code === mySub.subscriptionType || p.id === mySub.planId)?.id, // Try to match
                        type: mySub.subscriptionType,
                        isActive: true,
                        endDate: mySub.endDate,
                        autoRenew: false // Backend doesn't return autoRenew yet usually, default false
                    });
                } else {
                    setCurrentSubscription({ isActive: false });
                }
            }
        } catch (error) {
            console.error("Error fetching subscription data", error);
        } finally {
            setLoading(false);
        }
    };

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

    const handleSubscribe = async (plan) => {
        if (loading || !shopOwnerId) return;

        if (!window.confirm(t('shopOwner.subscription.confirmSubscribe', {
            plan: plan.name,
            price: formatCurrency(planDuration === 'MONTHLY' ? plan.monthlyPrice : plan.yearlyPrice)
        }))) {
            return;
        }

        setLoading(true);
        try {
            await subscribeToPlan(shopOwnerId, plan.id, planDuration);
            alert(t('shopOwner.subscription.subscribeSuccess'));
            fetchData(); // Reload all data
        } catch (error) {
            alert(error.message || t('shopOwner.subscription.subscribeError'));
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        alert("Feature coming soon! Contact support to cancel.");
        // Implement cancel API if needed
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
            {currentSubscription.isActive && (
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
                                    {/* Try to find plan name */}
                                    {plans.find(p => p.code === currentSubscription.type)?.name || currentSubscription.type}
                                </h6>
                                <p className="text-muted mb-2">
                                    {t('shopOwner.subscription.activeUntil')}: {formatDate(currentSubscription.endDate)}
                                </p>
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
                {plans.length > 0 ? plans.map(plan => (
                    <div className="col-md-4" key={plan.id}>
                        <div className="card h-100 position-relative" style={{
                            border: currentSubscription.isActive && currentSubscription.type === plan.code ? '2px solid green' : '1px solid #ddd',
                            transition: 'all 0.3s'
                        }}>
                            {plan.isPopular && (
                                <div className="position-absolute top-0 start-50 translate-middle">
                                    <span className="badge bg-danger px-3 py-2" style={{ fontSize: '0.85rem' }}>
                                        <i className="fas fa-star me-1"></i>
                                        {t('shopOwner.subscription.popular')}
                                    </span>
                                </div>
                            )}
                            <div className="card-header text-center" style={{ background: (plan.color || '#4caf50') + '20', marginTop: plan.isPopular ? '20px' : '0' }}>
                                <i className={`fas ${plan.icon} fa-3x mb-3`} style={{ color: plan.color }}></i>
                                <h5 className="fw-bold">{plan.name}</h5>
                            </div>
                            <div className="card-body">
                                <p className="text-muted mb-4">{plan.description}</p>

                                <div className="mb-4">
                                    <h6 className="fw-bold mb-3">{t('shopOwner.subscription.features')}</h6>
                                    <ul className="list-unstyled">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="mb-2">
                                                <i className="fas fa-check-circle text-success me-2"></i>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="text-center mb-3">
                                    <div className="h3 fw-bold text-danger">
                                        {formatCurrency(planDuration === 'MONTHLY' ? plan.monthlyPrice : plan.yearlyPrice)}
                                    </div>
                                    <div className="text-muted small">
                                        / {planDuration === 'MONTHLY' ? t('shopOwner.subscription.perMonth') : t('shopOwner.subscription.perYear')}
                                    </div>
                                </div>

                                <button
                                    className={`btn w-100 ${currentSubscription.isActive && currentSubscription.type === plan.code ? 'btn-success' : 'btn-primary'}`}
                                    onClick={() => handleSubscribe(plan)}
                                    disabled={loading || (currentSubscription.isActive && currentSubscription.type === plan.code)}
                                >
                                    {currentSubscription.isActive && currentSubscription.type === plan.code
                                        ? t('shopOwner.subscription.currentPlan')
                                        : t('shopOwner.subscription.subscribe')
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-12 text-center py-5">
                        <p className="text-muted">No subscription plans available.</p>
                    </div>
                )}
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
                            <p className="small text-muted">
                                {t('shopOwner.subscription.commissionInfo.contactSupport')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

