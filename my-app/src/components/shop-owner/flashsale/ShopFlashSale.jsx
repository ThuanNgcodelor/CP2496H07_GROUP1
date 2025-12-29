import React, { useState, useEffect } from 'react';
import flashSaleAPI from '../../../api/flashSale/flashSaleAPI';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/config';
import '../ShopOwnerLayout.css'; // Import shared styles
import Cookies from 'js-cookie';

const ShopFlashSale = () => {
    const [sessions, setSessions] = useState([]);
    const [myRegistrations, setMyRegistrations] = useState([]);
    const [products, setProducts] = useState([]);

    // UI State
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [selectedSessionId, setSelectedSessionId] = useState('');
    const [selectedProductId, setSelectedProductId] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [stock, setStock] = useState('');
    const [selectedProductData, setSelectedProductData] = useState(null);

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (!token) {
            alert("Bạn chưa đăng nhập. Vui lòng đăng nhập lại!");
            return;
        }
        fetchSessions();
        fetchMyRegistrations();
        fetchMyProducts();
    }, []);

    // Update selected product data when ID changes
    useEffect(() => {
        if (selectedProductId) {
            const product = products.find(p => p.id === selectedProductId);
            setSelectedProductData(product || null);
        } else {
            setSelectedProductData(null);
        }
    }, [selectedProductId, products]);

    const fetchSessions = async () => {
        try {
            const data = await flashSaleAPI.getAllSessions();
            setSessions(data.filter(s => s.status === 'ACTIVE' || new Date(s.endTime) > new Date()));
        } catch (error) {
            console.error("Failed to fetch sessions");
        }
    };

    const fetchMyRegistrations = async () => {
        try {
            const data = await flashSaleAPI.getMyRegistrations();
            setMyRegistrations(data);
        } catch (error) {
            console.error("Failed to fetch registrations");
        }
    };

    const fetchMyProducts = async () => {
        try {
            const token = Cookies.get('accessToken');
            if (!token) return;

            const response = await axios.get(`${API_BASE_URL}/v1/stock/product/listPageShopOwner?pageSize=1000&pageNo=1`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(response.data.content || []);
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await flashSaleAPI.registerProduct({
                sessionId: selectedSessionId,
                productId: selectedProductId,
                salePrice: parseFloat(salePrice),
                flashSaleStock: parseInt(stock)
            });
            alert('Đăng ký thành công! Chờ Admin duyệt.');
            fetchMyRegistrations();
            // Reset form and go back to list
            setSalePrice('');
            setStock('');
            setSelectedProductId('');
            setIsRegistering(false);
        } catch (error) {
            console.error(error);
            alert('Đăng ký thất bại: ' + (error.response?.data?.message || 'Lỗi không xác định'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            {/* Header */}
            <div className="dashboard-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>{isRegistering ? 'Đăng Ký Sản Phẩm Mới' : 'Quản Lý Flash Sale'}</h1>
                        <p className="text-muted">
                            {isRegistering
                                ? 'điền thông tin sản phẩm để tham gia chương trình Flash Sale'
                                : 'Danh sách các sản phẩm đã đăng ký tham gia Flash Sale'}
                        </p>
                    </div>
                    {isRegistering ? (
                        <button
                            className="btn btn-secondary-shop"
                            onClick={() => setIsRegistering(false)}
                        >
                            <i className="fas fa-arrow-left"></i> Quay lại
                        </button>
                    ) : (
                        <button
                            className="btn btn-primary-shop"
                            onClick={() => setIsRegistering(true)}
                        >
                            <i className="fas fa-plus"></i> Đăng Ký Tham Gia
                        </button>
                    )}
                </div>
            </div>

            {isRegistering ? (
                /* Registration Form View */
                <form onSubmit={handleRegister}>
                    <div className="row">
                        <div className="col-md-8">
                            <div className="card" style={{ marginBottom: '20px' }}>
                                <div className="card-header">
                                    <h5><i className="fas fa-info-circle"></i> Thông tin đăng ký</h5>
                                </div>
                                <div className="card-body">
                                    {/* Session Selection */}
                                    <div className="mb-3">
                                        <label className="form-label">Chọn Chương Trình <span style={{ color: 'red' }}>*</span></label>
                                        <select
                                            className="form-select"
                                            value={selectedSessionId}
                                            onChange={e => setSelectedSessionId(e.target.value)}
                                            required
                                        >
                                            <option value="">-- Chọn khung giờ Flash Sale --</option>
                                            {sessions.map(s => (
                                                <option key={s.id} value={s.id}>
                                                    {s.name} ({new Date(s.startTime).toLocaleString('vi-VN')} - {new Date(s.endTime).toLocaleString('vi-VN')})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Product Selection */}
                                    <div className="mb-3">
                                        <label className="form-label">Chọn Sản Phẩm <span style={{ color: 'red' }}>*</span></label>
                                        <select
                                            className="form-select"
                                            value={selectedProductId}
                                            onChange={e => setSelectedProductId(e.target.value)}
                                            required
                                        >
                                            <option value="">-- Chọn sản phẩm tham gia --</option>
                                            {products.map(p => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} - Giá gốc: {p.price?.toLocaleString()}đ (Kho: {p.totalStock})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Product Details Display (Read-only) */}
                                    {selectedProductData && (
                                        <div className="alert alert-info border-0 bg-blue-50 text-blue-700">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="bg-white rounded d-flex align-items-center justify-content-center border"
                                                    style={{ width: '60px', height: '60px', overflow: 'hidden' }}>
                                                    {selectedProductData.imageId ? (
                                                        <img
                                                            src={`${API_BASE_URL}/v1/file-storage/get/${selectedProductData.imageId}`}
                                                            alt={selectedProductData.name}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <i className="fas fa-box text-2xl text-blue-300"></i>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="fw-bold fs-5">{selectedProductData.name}</div>
                                                    <div className="text-sm">Danh mục: {selectedProductData.categoryName}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Giá Sale (VND) <span style={{ color: 'red' }}>*</span></label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={salePrice}
                                                    onChange={e => setSalePrice(e.target.value)}
                                                    required
                                                    min="1000"
                                                    placeholder="Nhập giá khuyến mãi"
                                                />
                                                {selectedProductData && salePrice && (
                                                    <small className={`d-block mt-1 ${parseFloat(salePrice) >= selectedProductData.price ? 'text-danger' : 'text-success'}`}>
                                                        {parseFloat(salePrice) >= selectedProductData.price
                                                            ? 'Lưu ý: Giá sale phải thấp hơn giá gốc!'
                                                            : `Giảm: ${Math.round((1 - parseFloat(salePrice) / selectedProductData.price) * 100)}%`}
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Số Lượng Đăng Ký <span style={{ color: 'red' }}>*</span></label>
                                                <input
                                                    type="number"
                                                    className={`form-control ${selectedProductData && parseInt(stock) > selectedProductData.totalStock ? 'is-invalid' : ''}`}
                                                    value={stock}
                                                    onChange={e => {
                                                        const val = e.target.value;
                                                        setStock(val);
                                                    }}
                                                    required
                                                    min="1"
                                                    max={selectedProductData?.totalStock}
                                                    placeholder="Số lượng bán trong khung giờ"
                                                />
                                                {selectedProductData && (
                                                    <>
                                                        <small className="text-muted d-block mt-1">
                                                            Tồn kho khả dụng: {selectedProductData.totalStock}
                                                        </small>
                                                        {parseInt(stock) > selectedProductData.totalStock && (
                                                            <div className="invalid-feedback d-block">
                                                                Số lượng đăng ký không thể vượt quá tồn kho hiện có!
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="col-md-4">
                            <div className="card" style={{ position: 'sticky', top: '20px' }}>
                                <div className="card-header">
                                    <h5><i className="fas fa-check-circle"></i> Xác nhận</h5>
                                </div>
                                <div className="card-body">
                                    <p className="text-muted small mb-3">
                                        Vui lòng kiểm tra kỹ thông tin trước khi gửi đăng ký. Admin sẽ duyệt sản phẩm của bạn trước khi hiển thị.
                                    </p>
                                    <div className="d-grid gap-2">
                                        <button
                                            type="submit"
                                            className="btn btn-primary-shop"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <><i className="fas fa-spinner fa-spin"></i> Đang xử lý...</>
                                            ) : (
                                                <><i className="fas fa-paper-plane"></i> Gửi Đăng Ký</>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary-shop"
                                            onClick={() => setIsRegistering(false)}
                                        >
                                            Hủy bỏ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                /* List View */
                <div className="card pb-5">
                    <div className="table-header">
                        <h5 className="table-title mb-0">Lịch Sử Đăng Ký</h5>
                    </div>
                    <div className="card-body p-0">
                        {myRegistrations.length === 0 ? (
                            <div className="text-center py-5">
                                <div className="text-gray-300 text-5xl mb-3"><i className="fas fa-inbox"></i></div>
                                <p className="text-gray-500">Bạn chưa đăng ký sản phẩm nào tham gia Flash Sale.</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="bg-light text-muted">
                                        <tr>
                                            <th className="ps-4 py-3">Sản Phẩm</th>
                                            <th className="py-3">Chương Trình</th>
                                            <th className="py-3">Giá Gốc</th>
                                            <th className="py-3">Giá Sale</th>
                                            <th className="py-3">Số Lượng</th>
                                            <th className="py-3 text-center">Trạng Thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myRegistrations.map(reg => {
                                            const session = sessions.find(s => s.id === reg.sessionId);
                                            const product = products.find(p => p.id === reg.productId);
                                            return (
                                                <tr key={reg.id}>
                                                    <td className="ps-4 py-3">
                                                        <div className="d-flex align-items-center">
                                                            <div className="bg-light rounded d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                                                                <i className="fas fa-box text-secondary"></i>
                                                            </div>
                                                            <div>
                                                                <div className="fw-bold text-dark">{product?.name || 'Sản phẩm ' + reg.productId}</div>
                                                                <small className="text-muted">Mã: {reg.productId.substring(0, 8)}</small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 text-primary small">
                                                        {session ? session.name : reg.sessionId}
                                                    </td>
                                                    <td className="py-3">{product?.price?.toLocaleString()}đ</td>
                                                    <td className="py-3 fw-bold text-danger">{reg.salePrice?.toLocaleString()}đ</td>
                                                    <td className="py-3">{reg.flashSaleStock}</td>
                                                    <td className="py-3 text-center">
                                                        <span className={`badge rounded-pill ${reg.status === 'APPROVED' ? 'bg-success' :
                                                            reg.status === 'REJECTED' ? 'bg-danger' : 'bg-warning text-dark'
                                                            }`}>
                                                            {reg.status}
                                                        </span>
                                                        {reg.rejectionReason && (
                                                            <div className="text-danger small mt-1" style={{ fontSize: '11px', maxWidth: '150px', margin: '0 auto' }}>
                                                                {reg.rejectionReason}
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopFlashSale;
