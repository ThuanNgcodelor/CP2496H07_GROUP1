import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useSearchParams } from 'react-router-dom';
import { getShopOwnerOrders, updateOrderStatusForShopOwner, returnOrder, getAllShopOwnerOrders, searchOrders } from '../../api/order';
import { getUserById } from '../../api/user';
import { useTranslation } from 'react-i18next';
import '../../components/shop-owner/ShopOwnerLayout.css';

export default function ReturnOrderPage() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(10);
    const [usernames, setUsernames] = useState({});
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null); // null = not searching

    // Load orders
    useEffect(() => {
        loadOrders();
    }, [currentPage, statusFilter]);

    // Auto-expand order if orderId is in URL
    useEffect(() => {
        const orderIdFromUrl = searchParams.get('orderId');
        if (orderIdFromUrl && orders.length > 0) {
            const orderExists = orders.some(order => order.id === orderIdFromUrl);
            if (orderExists) {
                setExpandedRows(prev => {
                    if (!prev.has(orderIdFromUrl)) {
                        return new Set([...prev, orderIdFromUrl]);
                    }
                    return prev;
                });
                setTimeout(() => {
                    const element = document.querySelector(`[data-order-id="${orderIdFromUrl}"]`);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        element.style.backgroundColor = '#fff3cd';
                        setTimeout(() => {
                            element.style.backgroundColor = '';
                        }, 2000);
                    }
                }, 300);
            }
        }
    }, [searchParams, orders]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            // Filter for CANCELLED and RETURNED orders if no specific filter is selected
            let filterValue = statusFilter && statusFilter.trim() !== '' ? statusFilter : ['CANCELLED', 'RETURNED'];

            const response = await getShopOwnerOrders(filterValue, currentPage, pageSize);

            let ordersList = [];
            if (response && response.content && Array.isArray(response.content)) {
                ordersList = response.content;
                setTotalPages(response.totalPages || 1);
            } else if (Array.isArray(response)) {
                ordersList = response;
                setTotalPages(1);
            } else if (response && response.data && Array.isArray(response.data)) {
                ordersList = response.data;
                setTotalPages(response.totalPages || 1);
            } else {
                ordersList = [];
                setTotalPages(1);
            }

            setOrders(ordersList);

            const userIds = [...new Set(ordersList.map(order => order.userId).filter(Boolean))];
            const usernameMap = {};

            await Promise.all(
                userIds.map(async (userId) => {
                    try {
                        const userData = await getUserById(userId);
                        usernameMap[userId] = userData.username || userData.email || `User ${userId}`;
                    } catch (err) {
                        console.error(`Error fetching user ${userId}:`, err);
                        usernameMap[userId] = `User ${userId}`;
                    }
                })
            );

            setUsernames(usernameMap);
        } catch (err) {
            console.error('Error loading orders:', err);
            setError('Failed to load orders list');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setSearchResults(null);
            return;
        }
        try {
            const results = await searchOrders(searchQuery.trim());
            // Filter results to only show Return/Cancel related orders if needed, 
            // or just show what matches. Since this is the "Return Order Page", 
            // maybe we should filter. But usually search overrides default filters.
            // Let's filter to keep context relevant.
            const relevantResults = results.filter(o =>
                ['CANCELLED', 'RETURNED', 'DELIVERED', 'COMPLETED'].includes(o.orderStatus)
            );
            // Note: DELIVERED/COMPLETED might be here because you can Return a DELIVERED order.
            setSearchResults(relevantResults);
        } catch (err) {
            console.error('Search error:', err);
            setSearchResults([]);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults(null);
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        const result = await Swal.fire({
            title: t('shopOwner.manageOrder.confirmUpdateTitle', 'Xác nhận cập nhật'),
            text: t('shopOwner.manageOrder.confirmUpdate', { status: getStatusLabel(newStatus) }),
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t('common.yes', 'Đồng ý'),
            cancelButtonText: t('common.no', 'Hủy')
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            await updateOrderStatusForShopOwner(orderId, newStatus);
            Swal.fire({
                icon: 'success',
                title: t('shopOwner.manageOrder.successUpdate'),
                showConfirmButton: false,
                timer: 1500
            });
            loadOrders();
        } catch (err) {
            console.error('Error updating order status:', err);
            Swal.fire({
                icon: 'error',
                title: 'Failed to update order status',
                text: err.message
            });
        }
    };

    const handleReturn = async (orderId) => {
        const { value: reason } = await Swal.fire({
            title: t('shopOwner.returnOrder.enterReason'),
            input: 'text',
            inputLabel: 'Lý do trả hàng',
            inputPlaceholder: 'Nhập lý do...',
            showCancelButton: true,
            confirmButtonText: t('common.submit', 'Gửi'),
            cancelButtonText: t('common.cancel', 'Hủy'),
            inputValidator: (value) => {
                if (!value) {
                    return 'Bạn phải nhập lý do!';
                }
            }
        });

        if (!reason) return;

        try {
            await returnOrder(orderId, reason);
            Swal.fire({
                icon: 'success',
                title: t('shopOwner.returnOrder.returnSuccess'),
                showConfirmButton: false,
                timer: 1500
            });
            loadOrders();
        } catch (err) {
            console.error('Error returning order:', err);
            Swal.fire({
                icon: 'error',
                title: 'Failed to return order',
                text: err.message
            });
        }
    };

    const toggleRowExpand = (orderId) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(orderId)) {
            newExpanded.delete(orderId);
        } else {
            newExpanded.add(orderId);
        }
        setExpandedRows(newExpanded);
    };

    const STATUS_NUMERIC_MAP = {
        0: 'PENDING',
        1: 'CONFIRMED',
        2: 'READY_TO_SHIP',
        3: 'SHIPPED',
        4: 'DELIVERED',
        5: 'COMPLETED',
        6: 'CANCELLED',
        7: 'RETURNED'
    };

    const normalizeStatus = (status) => {
        if (status === null || status === undefined) return '';
        if (typeof status === 'number') return STATUS_NUMERIC_MAP[status] || String(status);
        return String(status).toUpperCase();
    };

    const getStatusBadge = (status) => {
        const normalizedStatus = normalizeStatus(status);
        const statusMap = {
            PENDING: { label: t('common.status.pending'), class: 'bg-warning' },
            CONFIRMED: { label: t('common.status.confirmed'), class: 'bg-info' },
            READY_TO_SHIP: { label: t('common.status.readyToShip') || 'Sẵn sàng giao', class: 'bg-primary' },
            SHIPPED: { label: t('common.status.shipped'), class: 'bg-success' },
            DELIVERED: { label: t('common.status.delivered'), class: 'bg-success' },
            CANCELLED: { label: t('common.status.cancelled'), class: 'bg-danger' },
            COMPLETED: { label: t('common.status.completed'), class: 'bg-success' },
            RETURNED: { label: t('common.status.returned'), class: 'bg-secondary' }
        };

        return statusMap[normalizedStatus] || { label: status || 'N/A', class: 'bg-secondary' };
    };

    const getStatusLabel = (status) => {
        const normalized = normalizeStatus(status);
        const statusMap = {
            PENDING: 'Chờ xác nhận',
            CONFIRMED: 'Đã xác nhận',
            READY_TO_SHIP: 'Sẵn sàng giao',
            SHIPPED: 'Đang giao',
            DELIVERED: 'Đã giao',
            CANCELLED: 'Đã hủy',
            COMPLETED: 'Hoàn thành',
            RETURNED: 'Đã hoàn'
        };
        return statusMap[normalized] || normalized || 'N/A';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    const formatPrice = (price) => {
        if (price == null) return '0 đ';
        return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
    };

    const getNextStatus = (currentStatus) => {
        const cur = normalizeStatus(currentStatus);
        const statusFlow = {
            PENDING: 'CONFIRMED',
            CONFIRMED: 'READY_TO_SHIP'
        };
        return statusFlow[cur];
    };

    const handleExportExcel = async () => {
        try {
            setLoading(true);
            const filter = ['CANCELLED', 'RETURNED'];
            const allOrders = await getAllShopOwnerOrders(filter);

            if (!allOrders || allOrders.length === 0) {
                Swal.fire({
                    icon: 'info',
                    title: t('shopOwner.manageOrder.noOrdersToExport', 'Không có đơn hàng để xuất')
                });
                setLoading(false);
                return;
            }

            const headers = [
                "Order ID",
                "Customer Name",
                "Product",
                "Subtotal",
                "Shipping Fee",
                "Total",
                "Date",
                "Status",
                "Cancel Reason",
                "Return Reason"
            ];

            const escapeCsv = (str) => {
                if (str === null || str === undefined) return '';
                return `"${String(str).replace(/"/g, '""')}"`;
            };

            const csvRows = [headers.join(',')];

            for (const order of allOrders) {
                const subtotal = order.totalPrice;
                const shipping = order.shippingFee || 0;
                const total = (order.totalPrice || 0) + shipping;
                const date = new Date(order.creationTimestamp).toLocaleDateString('vi-VN');
                const customerName = usernames[order.userId] || `User: ${order.userId}`;

                const productStr = order.orderItems ? order.orderItems.map(item => {
                    const name = item.productName || `Product ${item.productId}`;
                    const size = item.sizeName ? ` (${item.sizeName})` : '';
                    return `${name}${size} x${item.quantity || 1}`;
                }).join('; ') : '';

                const row = [
                    escapeCsv(order.id),
                    escapeCsv(customerName),
                    escapeCsv(productStr),
                    order.totalPrice,
                    shipping,
                    total,
                    escapeCsv(date),
                    escapeCsv(order.orderStatus),
                    escapeCsv(order.cancelReason),
                    escapeCsv(order.returnReason)
                ];
                csvRows.push(row.join(','));
            }

            const bom = '\uFEFF';
            const csvString = bom + csvRows.join('\n');
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `return_orders_export_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err) {
            console.error('Export failed:', err);
            Swal.fire({
                icon: 'error',
                title: 'Xuất file thất bại',
                text: err.message
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading && orders.length === 0) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>{t('shopOwner.returnOrder.title')}</h1>
                </div>
                <div className="text-center py-5">
                    <i className="fas fa-spinner fa-spin fa-3x" style={{ color: '#ee4d2d' }}></i>
                    <p className="mt-3">{t('shopOwner.manageOrder.loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>{t('shopOwner.returnOrder.title')}</h1>
                <p className="text-muted">{t('shopOwner.manageOrder.subtitle', 'Quản lý đơn hàng trả lại và hủy')}</p>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div className="orders-table">
                <div className="table-header">
                    <div className="table-title">{t('shopOwner.returnOrder.tableTitle')}</div>
                    <div className="table-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Search Box */}
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tìm theo mã đơn..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                style={{ width: '180px' }}
                            />
                            <button className="btn btn-outline-secondary" onClick={handleSearch}>
                                <i className="fas fa-search"></i>
                            </button>
                            {searchResults !== null && (
                                <button className="btn btn-outline-secondary" onClick={clearSearch}>
                                    <i className="fas fa-times"></i>
                                </button>
                            )}
                        </div>

                        <div className="search-filter">
                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                    setSearchResults(null);
                                }}
                                style={{ width: '180px' }}
                            >
                                <option value="">{t('shopOwner.manageOrder.allStatus')}</option>
                                <option value="PENDING">{t('common.status.pending')}</option>
                                <option value="CONFIRMED">{t('common.status.confirmed')}</option>
                                <option value="READY_TO_SHIP">Sẵn sàng giao</option>
                                <option value="SHIPPED">{t('common.status.shipped')}</option>
                                <option value="DELIVERED">{t('common.status.delivered')}</option>
                                <option value="COMPLETED">{t('common.status.completed')}</option>
                                <option value="CANCELLED">{t('common.status.cancelled')}</option>
                                <option value="RETURNED">{t('common.status.returned')}</option>
                            </select>
                        </div>

                        <button className="btn btn-secondary-shop" onClick={loadOrders}>
                            <i className="fas fa-sync-alt"></i> {t('shopOwner.manageOrder.refresh')}
                        </button>
                        <button className="btn btn-primary-shop" onClick={handleExportExcel}>
                            <i className="fas fa-download"></i> {t('shopOwner.manageOrder.exportExcel')}
                        </button>
                    </div>
                </div>

                <div className="table-responsive" style={{ overflowX: 'auto' }}>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: '12%' }}>{t('shopOwner.manageOrder.customer')}</th>
                                <th style={{ width: '10%' }}>{t('shopOwner.manageOrder.phone')}</th>
                                <th style={{ width: '18%' }}>{t('shopOwner.manageOrder.address')}</th>
                                <th style={{ width: '9%' }}>{t('shopOwner.manageOrder.subtotal')}</th>
                                <th style={{ width: '9%' }}>{t('shopOwner.manageOrder.shipping')}</th>
                                <th style={{ width: '9%' }}>{t('shopOwner.manageOrder.total')}</th>
                                <th style={{ width: '9%' }}>{t('shopOwner.manageOrder.orderDate')}</th>
                                <th style={{ width: '9%' }}>{t('common.status.title')}</th>
                                <th style={{ width: '11%' }}>{t('shopOwner.manageOrder.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Search Results Info */}
                            {searchResults !== null && (
                                <tr>
                                    <td colSpan="9" className="bg-info bg-opacity-10 py-2 px-3">
                                        <i className="fas fa-search me-2"></i>
                                        Tìm thấy <strong>{searchResults.length}</strong> đơn hàng với từ khóa "{searchQuery}"
                                        <button className="btn btn-link btn-sm" onClick={clearSearch}>Xóa tìm kiếm</button>
                                    </td>
                                </tr>
                            )}

                            {(searchResults || orders).length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-4">
                                        <p className="text-muted">{searchResults !== null ? 'Không tìm thấy đơn hàng' : t('shopOwner.manageOrder.noOrders')}</p>
                                    </td>
                                </tr>
                            ) : (
                                (searchResults || orders).map((order) => {
                                    const statusInfo = getStatusBadge(order.orderStatus);
                                    const nextStatus = getNextStatus(order.orderStatus);
                                    const isExpanded = expandedRows.has(order.id);

                                    // Calculate financials
                                    const subtotal = order.totalPrice; // Assuming backend sends subtotal as totalPrice or we stick to existing logic
                                    // In BulkShippingPage logic was: subtotal + shipping - voucher = total.
                                    // Here ReturnOrderPage logic was: totalPrice is subtotal, + shipping = total. 
                                    // Let's stick to consistent logic: order.totalPrice usually means the final price in many systems, 
                                    // but let's check the existing logic in this file: 
                                    // <td>{formatPrice(order.totalPrice)}</td> (Subtotal Col)
                                    // <td>{formatPrice((order.totalPrice || 0) + (order.shippingFee || 0))}</td> (Total Col)
                                    // I will PRESERVE this existing calculation logic for safety.

                                    return (
                                        <React.Fragment key={order.id}>
                                            <tr data-order-id={order.id}>
                                                <td>{usernames[order.userId] || order.userId || 'N/A'}</td>
                                                <td>{order.recipientPhone || 'N/A'}</td>
                                                <td>
                                                    <div style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={order.fullAddress || order.shippingAddress}>
                                                        {order.fullAddress || order.shippingAddress || 'N/A'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <strong style={{ color: '#555' }}>
                                                        {formatPrice(order.totalPrice)}
                                                    </strong>
                                                </td>
                                                <td>
                                                    <span style={{ color: '#666', fontSize: '0.9rem' }}>
                                                        {order.shippingFee ? formatPrice(order.shippingFee) : '0 đ'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <strong style={{ color: '#ee4d2d' }}>
                                                        {formatPrice((order.totalPrice || 0) + (order.shippingFee || 0))}
                                                    </strong>
                                                </td>
                                                <td>{formatDate(order.creationTimestamp)}</td>
                                                <td>
                                                    <span className={`badge ${statusInfo.class}`}>
                                                        {statusInfo.label}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => toggleRowExpand(order.id)}
                                                            title={isExpanded ? "Hide details" : "Show details"}
                                                        >
                                                            <i className={`fas fa-${isExpanded ? 'chevron-up' : 'eye'}`}></i>
                                                        </button>
                                                        {nextStatus && (
                                                            <button
                                                                className="btn btn-sm btn-outline-success"
                                                                onClick={() => handleStatusUpdate(order.id, nextStatus)}
                                                                title={`Update to ${getStatusLabel(nextStatus)}`}
                                                            >
                                                                <i className="fas fa-check"></i>
                                                            </button>
                                                        )}
                                                        {order.orderStatus === 'DELIVERED' && (
                                                            <button
                                                                className="btn btn-sm btn-outline-warning"
                                                                onClick={() => handleReturn(order.id)}
                                                                title="Process Return"
                                                            >
                                                                <i className="fas fa-undo"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan="9" style={{ backgroundColor: '#f8f9fa', padding: '20px' }}>
                                                        <div style={{ paddingLeft: '20px' }}>
                                                            {/* Additional Order Info that was in Columns */}
                                                            <div className="row mb-3">
                                                                <div className="col-md-6">
                                                                    <strong>Recipient:</strong> {order.recipientName}
                                                                </div>
                                                            </div>

                                                            <h6 style={{ marginBottom: '15px', fontWeight: 'bold' }}>{t('shopOwner.returnOrder.productDetails')}:</h6>
                                                            <div className="table-responsive">
                                                                <table className="table table-sm table-bordered">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>{t('shopOwner.analytics.product')}</th>
                                                                            <th>Size</th>
                                                                            <th>{t('shopOwner.product.form.quantity')}</th>
                                                                            <th>{t('shopOwner.product.form.price')}</th>
                                                                            <th>{t('shopOwner.manageOrder.subtotal')}</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {order.orderItems && order.orderItems.map((item, itemIndex) => (
                                                                            <tr key={itemIndex}>
                                                                                <td>
                                                                                    <div className="d-flex align-items-center">
                                                                                        {item.productImage && (
                                                                                            <img
                                                                                                src={item.productImage}
                                                                                                alt=""
                                                                                                style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '10px' }}
                                                                                            />
                                                                                        )}
                                                                                        {item.productName || `Product ${item.productId}`}
                                                                                    </div>
                                                                                </td>
                                                                                <td>{item.sizeName || 'N/A'}</td>
                                                                                <td>{item.quantity || 1}</td>
                                                                                <td>{formatPrice(item.price || item.unitPrice || 0)}</td>
                                                                                <td>{formatPrice((item.price || item.unitPrice || 0) * (item.quantity || 1))}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                            <div className="mt-3 d-flex justify-content-end">
                                                                <div style={{ minWidth: '300px' }}>
                                                                    <div className="d-flex justify-content-between mb-2">
                                                                        <span>Subtotal:</span>
                                                                        <strong>{formatPrice(order.totalPrice)}</strong>
                                                                    </div>
                                                                    {order.shippingFee && order.shippingFee > 0 && (
                                                                        <div className="d-flex justify-content-between mb-2">
                                                                            <span>Shipping Fee (GHN):</span>
                                                                            <strong style={{ color: '#ee4d2d' }}>{formatPrice(order.shippingFee)}</strong>
                                                                        </div>
                                                                    )}
                                                                    <div className="d-flex justify-content-between pt-2 border-top">
                                                                        <strong>Total:</strong>
                                                                        <strong style={{ color: '#ee4d2d', fontSize: '1.1rem' }}>
                                                                            {formatPrice((order.totalPrice || 0) + (order.shippingFee || 0))}
                                                                        </strong>
                                                                    </div>

                                                                    {(order.cancelReason || order.returnReason) && (
                                                                        <div className="mt-3 p-3 bg-light rounded border border-warning">
                                                                            {order.cancelReason && (
                                                                                <div className="mb-2">
                                                                                    <strong className="text-danger">Cancel Reason:</strong>
                                                                                    <p className="mb-0 text-dark">{order.cancelReason}</p>
                                                                                </div>
                                                                            )}
                                                                            {order.returnReason && (
                                                                                <div>
                                                                                    <strong className="text-danger">Return Reason:</strong>
                                                                                    <p className="mb-0 text-dark">{order.returnReason}</p>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <div>
                            <small className="text-muted">
                                {t('shopOwner.returnOrder.pageInfo', { current: currentPage, total: totalPages })}
                            </small>
                        </div>
                        <div>
                            <button
                                className="btn btn-sm btn-outline-secondary me-2"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                <i className="fas fa-chevron-left"></i> {t('shopOwner.returnOrder.previous')}
                            </button>
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                {t('shopOwner.returnOrder.next')} <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}