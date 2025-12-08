# 🏪 CẤU HÌNH ĐỊA CHỈ SHOP CHO GHN

## ❌ LỖI: FROM_ADDRESS_CONVERT_FAIL

**Lỗi:** `"Address convert from fail: Chuyển đổi địa chỉ gửi không thành công"`

**Nguyên nhân:** GHN không thể chuyển đổi địa chỉ shop (FROM address) vì chưa được cấu hình trong GHN dashboard.

---

## ✅ GIẢI PHÁP 1: CẤU HÌNH TRONG GHN DASHBOARD (KHUYẾN NGHỊ)

### Bước 1: Đăng nhập GHN Dashboard

1. Truy cập: https://5sao.ghn.dev (Staging) hoặc https://khachhang.ghn.vn (Production)
2. Đăng nhập với tài khoản của bạn

### Bước 2: Cấu hình địa chỉ shop

1. Vào menu: **"Quản lý cửa hàng"** hoặc **"Thông tin cửa hàng"**
2. Tìm phần **"Địa chỉ shop"** hoặc **"Địa chỉ gửi hàng"**
3. Nhập đầy đủ thông tin:
   - **Tên shop:** Tên cửa hàng của bạn
   - **Số điện thoại:** Số điện thoại shop
   - **Địa chỉ:** Địa chỉ cụ thể (số nhà, tên đường)
   - **Tỉnh/Thành phố:** Chọn từ dropdown
   - **Quận/Huyện:** Chọn từ dropdown
   - **Phường/Xã:** Chọn từ dropdown
4. **Lưu** địa chỉ shop

### Bước 3: Kiểm tra lại

Sau khi cấu hình xong, thử đặt hàng lại. GHN sẽ tự động lấy địa chỉ shop từ dashboard.

---

## ✅ GIẢI PHÁP 2: THÊM FROM ADDRESS VÀO REQUEST (NẾU CẦN)

Nếu không thể cấu hình trong dashboard, có thể thêm FROM address vào request:

### Bước 1: Cập nhật `application.properties`

```properties
# GHN Shop Address (FROM address)
ghn.shop.from.name=Shop Name
ghn.shop.from.phone=0123456789
ghn.shop.from.address=123 Đường ABC
ghn.shop.from.ward_code=WardCode
ghn.shop.from.district_id=DistrictID
```

### Bước 2: Lấy thông tin địa chỉ

- **Ward Code:** Lấy từ GHN API `/master-data/ward`
- **District ID:** Lấy từ GHN API `/master-data/district`
- **Address:** Địa chỉ cụ thể của shop

### Bước 3: Restart service

Sau khi cập nhật, restart `order-service`.

---

## 📋 CHECKLIST

- [ ] Đăng nhập GHN Dashboard (5sao.ghn.dev hoặc khachhang.ghn.vn)
- [ ] Vào "Quản lý cửa hàng"
- [ ] Tìm phần "Địa chỉ shop" hoặc "Địa chỉ gửi hàng"
- [ ] Nhập đầy đủ thông tin địa chỉ (Tỉnh, Quận, Phường, Địa chỉ cụ thể)
- [ ] Lưu địa chỉ shop
- [ ] Thử đặt hàng lại

---

## 🔍 KIỂM TRA

Sau khi cấu hình, kiểm tra logs:

```
[GHN] ========== CREATING SHIPPING ORDER ==========
[GHN] Order ID: xxx
[GHN] Calling GHN API...
[GHN API] SUCCESS - Order Code: GHN12345ABC, Fee: 25000 VNĐ
[GHN] ✅ SUCCESS!
```

Nếu vẫn lỗi `FROM_ADDRESS_CONVERT_FAIL`, kiểm tra:
1. Địa chỉ shop đã được lưu trong GHN dashboard chưa?
2. Địa chỉ shop có đầy đủ Tỉnh/Quận/Phường không?
3. Shop ID có đúng không?

---

## 💡 LƯU Ý

- **Cách đơn giản nhất:** Cấu hình shop address trong GHN dashboard
- **Nếu không có quyền:** Liên hệ admin GHN để cấu hình
- **Test:** Sau khi cấu hình, test với 1 đơn hàng nhỏ trước

