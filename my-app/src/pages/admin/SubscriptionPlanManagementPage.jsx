import React, { useEffect, useState } from 'react';
import {
    getAllSubscriptionPlans, deleteSubscriptionPlan, toggleSubscriptionPlanActive,
    createSubscriptionPlan, updateSubscriptionPlan
} from '../../api/subscriptionPlan';
import Swal from 'sweetalert2';
import '../../assets/admin/css/SubscriptionPlanManagement.css';

const SubscriptionPlanManagementPage = () => {
    const [plans, setPlans] = useState([]);
    const [filteredPlans, setFilteredPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // FREESHIP_XTRA, VOUCHER_XTRA, BOTH
    const [filterStatus, setFilterStatus] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        subscriptionType: 'FREESHIP_XTRA',
        colorHex: '#4caf50',
        icon: 'truck',
        displayOrder: 0,
        commissionPaymentRate: 0.04,
        commissionFixedRate: 0.04,
        commissionFreeshipRate: 0.08,
        commissionVoucherRate: 0.05,
        voucherMaxPerItem: 50000,
        freeshipEnabled: false,
        voucherEnabled: false,
        isActive: true
    });

    useEffect(() => {
        fetchPlans();
    }, []);

    useEffect(() => {
        filterPlans();
    }, [plans, searchTerm, filterType, filterStatus]);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const data = await getAllSubscriptionPlans();
            setPlans(data);
        } catch (error) {
            console.error('Error fetching plans:', error);
            Swal.fire('Error!', 'Failed to fetch subscription plans.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filterPlans = () => {
        let filtered = [...plans];

        if (searchTerm) {
            filtered = filtered.filter(plan =>
                plan.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                plan.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                plan.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterType !== 'all') {
            filtered = filtered.filter(plan => plan.subscriptionType === filterType);
        }

        if (filterStatus !== 'all') {
            const isActive = filterStatus === 'active';
            filtered = filtered.filter(plan => plan.isActive === isActive);
        }

        setFilteredPlans(filtered);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await deleteSubscriptionPlan(id);
                setPlans(prev => prev.filter(p => p.id !== id));
                Swal.fire('Deleted!', 'Plan has been deleted.', 'success');
            } catch (error) {
                console.error('Error deleting plan:', error);
                Swal.fire('Error!', error.response?.data?.message || 'Failed to delete plan.', 'error');
            }
        }
    };

    const handleToggleActive = async (id) => {
        try {
            await toggleSubscriptionPlanActive(id);
            setPlans(prev => prev.map(p =>
                p.id === id ? { ...p, isActive: !p.isActive } : p
            ));
            Swal.fire('Success!', 'Plan status updated.', 'success');
        } catch (error) {
            console.error('Error toggling plan:', error);
            Swal.fire('Error!', 'Failed to update plan status.', 'error');
        }
    };

    const handleEdit = (plan) => {
        setEditingPlan(plan);
        setFormData({
            code: plan.code || '',
            name: plan.name || '',
            description: plan.description || '',
            subscriptionType: plan.subscriptionType || 'FREESHIP_XTRA',
            colorHex: plan.colorHex || '#4caf50',
            icon: plan.icon || 'truck',
            displayOrder: plan.displayOrder || 0,
            commissionPaymentRate: plan.commissionPaymentRate || 0.04,
            commissionFixedRate: plan.commissionFixedRate || 0.04,
            commissionFreeshipRate: plan.commissionFreeshipRate || 0.08,
            commissionVoucherRate: plan.commissionVoucherRate || 0.05,
            voucherMaxPerItem: plan.voucherMaxPerItem || 50000,
            freeshipEnabled: plan.freeshipEnabled || false,
            voucherEnabled: plan.voucherEnabled || false,
            isActive: plan.isActive !== undefined ? plan.isActive : true
        });
        setShowModal(true);
    };

    const handleCreate = () => {
        setEditingPlan(null);
        setFormData({
            code: '',
            name: '',
            description: '',
            subscriptionType: 'FREESHIP_XTRA',
            colorHex: '#4caf50',
            icon: 'truck',
            displayOrder: 0,
            commissionPaymentRate: 0.04,
            commissionFixedRate: 0.04,
            commissionFreeshipRate: 0.08,
            commissionVoucherRate: 0.05,
            voucherMaxPerItem: 50000,
            freeshipEnabled: false,
            voucherEnabled: false,
            isActive: true
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.code || !formData.name) {
            Swal.fire('Error!', 'Code and Name are required.', 'error');
            return;
        }

        try {
            if (editingPlan) {
                await updateSubscriptionPlan(editingPlan.id, formData);
                Swal.fire('Success!', 'Plan updated successfully.', 'success');
            } else {
                await createSubscriptionPlan(formData);
                Swal.fire('Success!', 'Plan created successfully.', 'success');
            }

            setShowModal(false);
            fetchPlans();
        } catch (error) {
            console.error('Error saving plan:', error);
            Swal.fire('Error!', error.response?.data?.message || 'Failed to save plan.', 'error');
        }
    };

    const getTypeBadge = (type) => {
        const badges = {
            'FREESHIP_XTRA': { label: 'Freeship Xtra', color: 'success' },
            'VOUCHER_XTRA': { label: 'Voucher Xtra', color: 'warning' },
            'BOTH': { label: 'Both', color: 'primary' },
            'NONE': { label: 'None', color: 'secondary' }
        };
        const badge = badges[type] || { label: type, color: 'secondary' };
        return <span className={`type-badge badge-${badge.color}`}>{badge.label}</span>;
    };

    const stats = {
        total: plans.length,
        active: plans.filter(p => p.isActive).length,
        freeshipXtra: plans.filter(p => p.subscriptionType === 'FREESHIP_XTRA').length,
        voucherXtra: plans.filter(p => p.subscriptionType === 'VOUCHER_XTRA').length,
        both: plans.filter(p => p.subscriptionType === 'BOTH').length
    };

    return (
        <div className="subscription-plan-management-page">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Subscription Plan Management</h1>
                    <p className="page-subtitle">Manage subscription plans for shop owners</p>
                </div>
                <button className="btn-create" onClick={handleCreate}>
                    <i className="fas fa-plus"></i> Create Plan
                </button>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon stat-icon-total">
                        <i className="fas fa-tags"></i>
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Total Plans</span>
                        <h2 className="stat-value">{stats.total}</h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon stat-icon-active">
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Active Plans</span>
                        <h2 className="stat-value">{stats.active}</h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon stat-icon-freeship">
                        <i className="fas fa-truck-fast"></i>
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Freeship Xtra</span>
                        <h2 className="stat-value">{stats.freeshipXtra}</h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon stat-icon-voucher">
                        <i className="fas fa-ticket-alt"></i>
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Voucher Xtra</span>
                        <h2 className="stat-value">{stats.voucherXtra}</h2>
                    </div>
                </div>
            </div>

            {/* Plans Table Card */}
            <div className="card plans-table-card">
                <div className="card-header">
                    <h3 className="card-title">All Plans</h3>
                    <div className="header-actions">
                        <div className="search-box">
                            <i className="fas fa-search"></i>
                            <input
                                type="text"
                                placeholder="Search plans..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>

                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Types</option>
                            <option value="FREESHIP_XTRA">Freeship Xtra</option>
                            <option value="VOUCHER_XTRA">Voucher Xtra</option>
                            <option value="BOTH">Both</option>
                        </select>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <div className="card-body">
                    {loading ? (
                        <div className="loading-state">
                            <i className="fas fa-spinner fa-spin"></i>
                            <p>Loading plans...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="plans-table">
                                <thead>
                                    <tr>
                                        <th>Icon</th>
                                        <th>Code</th>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Commission</th>
                                        <th>Display Order</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPlans.length > 0 ? (
                                        filteredPlans.map((plan) => (
                                            <tr key={plan.id}>
                                                <td>
                                                    <div className="plan-icon" style={{ backgroundColor: plan.colorHex + '20' }}>
                                                        <i className={`fas fa-${plan.icon}`} style={{ color: plan.colorHex }}></i>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="plan-code">{plan.code}</span>
                                                </td>
                                                <td>
                                                    <div className="plan-name-cell">
                                                        <span className="plan-name-text">{plan.name}</span>
                                                        {plan.description && (
                                                            <span className="plan-desc">{plan.description.substring(0, 50)}...</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>{getTypeBadge(plan.subscriptionType)}</td>
                                                <td>
                                                    <div className="commission-cell">
                                                        <span className="commission-chip">
                                                            Payment: {(plan.commissionPaymentRate * 100).toFixed(1)}%
                                                        </span>
                                                        <span className="commission-chip">
                                                            Fixed: {(plan.commissionFixedRate * 100).toFixed(1)}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="order-badge">{plan.displayOrder}</span>
                                                </td>
                                                <td>
                                                    <label className="toggle-switch">
                                                        <input
                                                            type="checkbox"
                                                            checked={plan.isActive}
                                                            onChange={() => handleToggleActive(plan.id)}
                                                        />
                                                        <span className="toggle-slider"></span>
                                                    </label>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            onClick={() => handleEdit(plan)}
                                                            className="btn-action btn-edit"
                                                            title="Edit Plan"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(plan.id)}
                                                            className="btn-action btn-delete"
                                                            title="Delete Plan"
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="no-data">
                                                <i className="fas fa-inbox"></i>
                                                <p>No plans found</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Create/Edit Modal - Simple version for now */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">
                                {editingPlan ? 'Edit Plan' : 'Create New Plan'}
                            </h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Code *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                            required
                                            disabled={!!editingPlan}
                                            placeholder="VD: FREESHIP_XTRA"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Name *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            placeholder="VD: Freeship Xtra"
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Description</label>
                                        <textarea
                                            className="form-input"
                                            rows="3"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Mô tả gói đăng ký..."
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Type *</label>
                                        <select
                                            className="form-input"
                                            value={formData.subscriptionType}
                                            onChange={(e) => setFormData({ ...formData, subscriptionType: e.target.value })}
                                            required
                                        >
                                            <option value="FREESHIP_XTRA">Freeship Xtra</option>
                                            <option value="VOUCHER_XTRA">Voucher Xtra</option>
                                            <option value="BOTH">Both</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Display Order</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={formData.displayOrder}
                                            onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                                            min="0"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Color (Hex)</label>
                                        <input
                                            type="color"
                                            className="form-input"
                                            value={formData.colorHex}
                                            onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Icon (FontAwesome)</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.icon}
                                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                            placeholder="VD: truck, ticket-alt"
                                        />
                                    </div>

                                    {/* Commission Rates Section */}
                                    <div className="form-group full-width">
                                        <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem', color: '#FF6B35' }}>Commission Rates</h4>
                                    </div>

                                    <div className="form-group">
                                        <label>Payment Rate (%) *</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={(formData.commissionPaymentRate * 100).toFixed(2)}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                commissionPaymentRate: parseFloat(e.target.value) / 100
                                            })}
                                            step="0.01"
                                            min="0"
                                            max="100"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Fixed Rate (%) *</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={(formData.commissionFixedRate * 100).toFixed(2)}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                commissionFixedRate: parseFloat(e.target.value) / 100
                                            })}
                                            step="0.01"
                                            min="0"
                                            max="100"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Freeship Rate (%) *</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={(formData.commissionFreeshipRate * 100).toFixed(2)}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                commissionFreeshipRate: parseFloat(e.target.value) / 100
                                            })}
                                            step="0.01"
                                            min="0"
                                            max="100"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Voucher Rate (%) *</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={(formData.commissionVoucherRate * 100).toFixed(2)}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                commissionVoucherRate: parseFloat(e.target.value) / 100
                                            })}
                                            step="0.01"
                                            min="0"
                                            max="100"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Voucher Max Per Item (VNĐ)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={formData.voucherMaxPerItem}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                voucherMaxPerItem: parseFloat(e.target.value)
                                            })}
                                            min="0"
                                        />
                                    </div>

                                    <div className="form-group">
                                        {/* Empty for grid alignment */}
                                    </div>

                                    {/* Feature Toggles */}
                                    <div className="form-group checkbox-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={formData.freeshipEnabled}
                                                onChange={(e) => setFormData({ ...formData, freeshipEnabled: e.target.checked })}
                                            />
                                            <span>Freeship Enabled</span>
                                        </label>
                                    </div>

                                    <div className="form-group checkbox-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={formData.voucherEnabled}
                                                onChange={(e) => setFormData({ ...formData, voucherEnabled: e.target.checked })}
                                            />
                                            <span>Voucher Enabled</span>
                                        </label>
                                    </div>

                                    <div className="form-group checkbox-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={formData.isActive}
                                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                            />
                                            <span>Active</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save">
                                    <i className="fas fa-save"></i> {editingPlan ? 'Update' : 'Create'} Plan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionPlanManagementPage;
