# VNPay Refund Debug Guide

## 🔍 Vấn Đề

Khi cancel order VNPay, refund không hiển thị trên VNPay merchant portal:
- URL: https://sandbox.vnpayment.vn/merchantv2/Transaction/SearchRefund.htm
- RefundTransaction được tạo trong database nhưng không có trên VNPay portal

## ✅ Đã Sửa

### 1. **Sửa Endpoint API**

**Trước:**
```java
String apiUrl = props.getApiUrl() + "/merchant_webapi/merchant.html";
// Kết quả: https://sandbox.vnpayment.vn/merchant_webapi/api/transaction/merchant_webapi/merchant.html ❌ SAI
```

**Sau:**
```java
String apiUrl = "https://sandbox.vnpayment.vn/merchant_webapi/merchant.html"; ✅ ĐÚNG
```

### 2. **Cải Thiện Error Handling**

- Đọc cả error response từ VNPay API
- Log chi tiết response code, transaction status, và error message
- Lưu full response vào `RefundTransaction.vnpayResponse` để debug

### 3. **Thêm Logging Chi Tiết**

- Log request params trước khi gọi API
- Log response code và full response
- Log parsed response params

## ⚠️ Lưu Ý Quan Trọng

### VNPay Sandbox Có Thể Không Hỗ Trợ Refund API Qua HTTP

Theo tài liệu VNPay và thực tế:
- **VNPay sandbox** có thể **KHÔNG hỗ trợ refund API qua HTTP**
- Refund có thể phải thực hiện **qua merchant portal** (web interface)
- Merchant portal: https://sandbox.vnpayment.vn/merchantv2/

### Các Trường Hợp Có Thể Xảy Ra

1. **API trả về lỗi** (response code != 200)
   - Check logs để xem error message
   - Có thể là endpoint không tồn tại hoặc không được hỗ trợ

2. **API trả về success nhưng refund không hiển thị trên portal**
   - VNPay sandbox có thể chỉ lưu refund trong database của họ
   - Không hiển thị trên merchant portal cho sandbox

3. **API không trả về gì (timeout hoặc connection error)**
   - Check network connection
   - Check firewall/proxy settings

## 🔧 Cách Debug

### 1. Kiểm Tra Logs

```bash
# Tìm log refund trong payment-service
grep "\[REFUND\]" logs/payment-service.log

# Xem chi tiết:
- Request params
- Response code
- Full response
- Parsed response params
```

### 2. Kiểm Tra Database

```sql
-- Kiểm tra RefundTransaction
SELECT * FROM refund_transactions 
WHERE payment_id = 'your-payment-id'
ORDER BY created_at DESC;

-- Xem vnpay_response để debug
SELECT id, status, vnpay_response_code, vnpay_transaction_status, 
       failure_reason, vnpay_response 
FROM refund_transactions 
WHERE payment_id = 'your-payment-id';
```

### 3. Test Refund API Trực Tiếp

Có thể test refund API bằng curl:

```bash
curl -X POST "https://sandbox.vnpayment.vn/merchant_webapi/merchant.html" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "vnp_RequestId=123456789012&vnp_Version=2.1.0&vnp_Command=refund&vnp_TmnCode=YOUR_TMN_CODE&vnp_TransactionType=03&vnp_TxnRef=YOUR_TXN_REF&vnp_Amount=100000&vnp_TransactionDate=20240101120000&vnp_CreateBy=admin&vnp_CreateDate=20240101130000&vnp_IpAddr=127.0.0.1&vnp_SecureHash=YOUR_HASH"
```

### 4. Kiểm Tra VNPay Merchant Portal

1. Đăng nhập vào: https://sandbox.vnpayment.vn/merchantv2/
2. Vào **Transaction** → **Search Refund**
3. Tìm refund theo:
   - Transaction Reference (vnp_TxnRef)
   - Order ID
   - Date range

## 📋 Refund Parameters

Các parameters cần thiết cho VNPay refund API:

| Parameter | Mô tả | Ví dụ |
|-----------|-------|-------|
| `vnp_RequestId` | Unique request ID (12 digits) | `123456789012` |
| `vnp_Version` | API version | `2.1.0` |
| `vnp_Command` | Command type | `refund` |
| `vnp_TmnCode` | Terminal code | `OCFVVWW0` |
| `vnp_TransactionType` | Transaction type | `03` (refund) |
| `vnp_TxnRef` | Original transaction reference | `123456789012` |
| `vnp_Amount` | Refund amount (in xu, x100) | `100000` (for 1,000 VNĐ) |
| `vnp_TransactionDate` | Original transaction date | `20240101120000` (yyyyMMddHHmmss) |
| `vnp_CreateBy` | Creator | `admin` |
| `vnp_CreateDate` | Refund creation date | `20240101130000` (yyyyMMddHHmmss) |
| `vnp_IpAddr` | IP address | `127.0.0.1` |
| `vnp_SecureHash` | HMAC SHA512 hash | (auto-generated) |

## 🚨 Giải Pháp Thay Thế

Nếu VNPay sandbox không hỗ trợ refund API:

### Option 1: Refund Qua Merchant Portal (Manual)

1. Khi cancel order, tạo `RefundTransaction` với status = `PENDING`
2. Admin vào VNPay merchant portal để refund manually
3. Sau khi refund xong, update `RefundTransaction` status = `COMPLETED`

### Option 2: Sử Dụng Production API

- Production VNPay có thể hỗ trợ refund API đầy đủ
- Cần test với production credentials

### Option 3: Mock Refund Cho Development

- Trong development, có thể mock refund response
- Tự động set status = `COMPLETED` sau khi tạo refund

## 📞 Liên Hệ VNPay Support

Nếu vẫn gặp vấn đề:
- **Hotline**: 1900 555577
- **Email**: support@vnpay.vn
- **Website**: https://vnpay.vn

## 📝 Code Changes

### Files Đã Sửa:

1. `payment-service/src/main/java/com/example/paymentservice/service/RefundService.java`
   - Sửa endpoint từ `props.getApiUrl() + "/merchant_webapi/merchant.html"` → hardcode endpoint đúng
   - Cải thiện error handling
   - Thêm logging chi tiết

### Next Steps:

1. Test refund với endpoint mới
2. Check logs để xem response từ VNPay
3. Nếu vẫn không work, có thể cần refund qua merchant portal
4. Hoặc liên hệ VNPay support để xác nhận refund API support

