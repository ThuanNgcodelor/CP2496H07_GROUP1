import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { checkMomoReturn } from "../../api/payment.js";

const MomoReturnPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const handleMomoReturn = async () => {
            try {
                // Get all query parameters from URL
                const urlParams = new URLSearchParams(window.location.search);
                const params = {};
                urlParams.forEach((value, key) => {
                    params[key] = value;
                });

                // Call payment service to verify and process return
                const response = await checkMomoReturn(params);
                const status = response?.status;

                if (status === "PAID") {
                    // Payment successful - show success message and redirect to orders
                    await Swal.fire({
                        icon: "success",
                        title: t('payment.success.title', 'Thanh toán thành công!'),
                        text: t('payment.success.text', 'Đơn hàng của bạn đã được tạo thành công.'),
                        confirmButtonText: t('payment.success.button', 'Xem đơn hàng'),
                        confirmButtonColor: "#a50064", // MoMo purple color
                    });

                    // Redirect to orders page
                    navigate("/information/orders");
                } else {
                    // Payment failed
                    await Swal.fire({
                        icon: "error",
                        title: t('payment.failed.title', 'Thanh toán thất bại'),
                        text: t('payment.failed.text', 'Giao dịch không thành công. Vui lòng thử lại.'),
                        confirmButtonText: t('payment.failed.button', 'Quay lại giỏ hàng'),
                        confirmButtonColor: "#a50064",
                    });

                    // Redirect back to cart
                    navigate("/cart");
                }
            } catch (error) {
                console.error("MoMo return error:", error);

                // Show error message
                await Swal.fire({
                    icon: "error",
                    title: t('payment.error.title', 'Lỗi xử lý thanh toán'),
                    text: error?.response?.data?.message || error?.message || t('payment.error.text', 'Đã có lỗi xảy ra'),
                    confirmButtonText: t('payment.error.button', 'Thử lại'),
                    confirmButtonColor: "#a50064",
                });

                // Redirect back to cart
                navigate("/cart");
            }
        };

        handleMomoReturn();
    }, [navigate, t]);

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            flexDirection: "column",
            gap: "1rem",
            background: "linear-gradient(135deg, #a50064 0%, #d82d8b 100%)"
        }}>
            <div style={{
                background: "#fff",
                padding: "2rem",
                borderRadius: "12px",
                textAlign: "center",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
            }}>
                <div className="spinner-border" style={{ color: "#a50064" }} role="status">
                    <span className="visually-hidden">{t('common.processing', 'Đang xử lý...')}</span>
                </div>
                <p style={{ marginTop: "1rem", color: "#333" }}>
                    {t('payment.momo.processing', 'Đang xử lý thanh toán MoMo...')}
                </p>
            </div>
        </div>
    );
};

export default MomoReturnPage;
