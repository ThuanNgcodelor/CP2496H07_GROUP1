import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getInventoryLogs, getLowStockProducts, adjustStock } from '../../api/inventory';
import { API_BASE_URL } from '../../config/config';
import Swal from 'sweetalert2';
// import moment from 'moment';

const InventoryPage = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('low-stock'); // 'low-stock', 'history', 'all'
    const [lowStockItems, setLowStockItems] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Load Low Stock
    const fetchLowStock = async () => {
        setLoading(true);
        try {
            const data = await getLowStockProducts();
            setLowStockItems(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Load History
    const fetchLogs = async (pageNo = 0) => {
        setLoading(true);
        try {
            const data = await getInventoryLogs({ page: pageNo, size: 10 });
            setLogs(data.content);
            setTotalPages(data.totalPages);
            setPage(pageNo);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'low-stock') fetchLowStock();
        if (activeTab === 'history') fetchLogs(0);
    }, [activeTab]);

    const handleAdjustStock = async (product, size) => {
        const { value: formValues } = await Swal.fire({
            title: t('inventory.adjustStock', 'Adjust Stock'),
            html:
                `<div>${product.name} - ${size.name}</div>` +
                `<div class="mt-2 text-muted small">${t('product.stock', 'Current Stock')}: <b>${size.stock}</b></div>` +
                `<input id="swal-input1" type="number" class="swal2-input" placeholder="${t('inventory.quantityToAdd', 'Quantity to Add')}" min="1">` +
                `<input id="swal-input2" class="swal2-input" placeholder="${t('inventory.reason', 'Reason (optional)')}">`,
            focusConfirm: false,
            preConfirm: () => {
                return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value
                ];
            }
        });

        if (formValues) {
            const [addedAmount, reason] = formValues;
            if (!addedAmount) return;

            const amount = parseInt(addedAmount);
            if (isNaN(amount) || amount <= 0) {
                Swal.fire(t('common.error'), 'Số lượng phải lớn hơn 0', 'error');
                return;
            }

            try {
                // Calculate new total stock logic: current + added
                const newStockTotal = size.stock + amount;

                await adjustStock({
                    productId: product.id,
                    sizeId: size.id,
                    newStock: newStockTotal,
                    reason: reason || t('inventory.logType.IMPORT', 'Import')
                });
                Swal.fire(t('common.success', 'Success'), t('inventory.success', 'Stock updated'), 'success');
                fetchLowStock(); // Refresh
            } catch (error) {
                Swal.fire(t('common.error', 'Error'), error.message, 'error');
            }
        }
    };

    return (
        <div className="container-fluid p-4">
            <h2 className="mb-4">{t('inventory.title', 'Inventory Management')}</h2>

            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'low-stock' ? 'active' : ''}`}
                        onClick={() => setActiveTab('low-stock')}
                    >
                        <i className="fas fa-exclamation-triangle me-2 text-warning"></i>
                        {t('inventory.lowStock', 'Low Stock Alerts')}
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        <i className="fas fa-history me-2"></i>
                        {t('inventory.history', 'Stock History')}
                    </button>
                </li>
            </ul>

            {loading && <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>}

            {!loading && activeTab === 'low-stock' && (
                <div className="card shadow-sm">
                    <div className="card-body">
                        {lowStockItems.length === 0 ? (
                            <div className="text-center py-4 text-muted">{t('inventory.noLowStock', 'No items match the low stock criteria.')}</div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>{t('product.name', 'Product Name')}</th>
                                            <th>{t('product.size', 'Size')}</th>
                                            <th>{t('product.stock', 'Current Stock')}</th>
                                            <th>{t('common.action', 'Action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lowStockItems.map(product => (
                                            (product.sizes || []).map(size => (
                                                size.stock <= 10 && (
                                                    <tr key={size.id}>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <img
                                                                    src={product.imageId ? `${API_BASE_URL}/v1/file-storage/get/${product.imageId}` : '/placeholder.png'}
                                                                    alt={product.name}
                                                                    style={{ width: 40, height: 40, objectFit: 'cover', marginRight: 10, borderRadius: 4 }}
                                                                    onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
                                                                />
                                                                {product.name}
                                                            </div>
                                                        </td>
                                                        <td><span className="badge bg-light text-dark border">{size.name}</span></td>
                                                        <td className="text-danger fw-bold">{size.stock}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() => handleAdjustStock(product, size)}
                                                            >
                                                                <i className="fas fa-edit me-1"></i> {t('inventory.adjust', 'Adjust')}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            ))
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {!loading && activeTab === 'history' && (
                <div className="card shadow-sm">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>{t('common.date', 'Date')}</th>
                                        <th>{t('product.name', 'Product')}</th>
                                        <th>{t('product.size', 'Size')}</th>
                                        <th>{t('inventory.change', 'Change')}</th>
                                        <th>{t('inventory.stockAfter', 'Stock After')}</th>
                                        <th>{t('inventory.type', 'Type')}</th>
                                        <th>{t('inventory.reason', 'Reason')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map(log => (
                                        <tr key={log.id}>
                                            <td style={{ fontSize: '0.9rem' }}>{new Date(log.createdTimestamp).toLocaleString('vi-VN')}</td>
                                            <td>{log.productName}</td>
                                            <td><span className="badge bg-light text-dark">{log.sizeName}</span></td>
                                            <td className={log.changeAmount > 0 ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                                                {log.changeAmount > 0 ? '+' : ''}{log.changeAmount}
                                            </td>
                                            <td>{log.currentStock}</td>
                                            <td>
                                                <span className={`badge ${log.type === 'ORDER' ? 'bg-info' :
                                                    log.type === 'IMPORT' ? 'bg-success' :
                                                        log.type === 'ADJUSTMENT' ? 'bg-warning text-dark' : 'bg-secondary'
                                                    }`}>
                                                    {t(`inventory.logType.${log.type}`, log.type)}
                                                </span>
                                            </td>
                                            <td className="text-muted small">{log.reason}</td>
                                        </tr>
                                    ))}
                                    {logs.length === 0 && (

                                        <tr><td colSpan="7" className="text-center py-4 text-muted">{t('common.noData', 'No history found')}</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        <div className="d-flex justify-content-end mt-3">
                            <button className="btn btn-sm btn-outline-secondary me-2" disabled={page === 0} onClick={() => fetchLogs(page - 1)}>&lt; Prev</button>
                            <span className="align-self-center mx-2">{page + 1} / {totalPages || 1}</span>
                            <button className="btn btn-sm btn-outline-secondary ms-2" disabled={page >= totalPages - 1} onClick={() => fetchLogs(page + 1)}>Next &gt;</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryPage;
