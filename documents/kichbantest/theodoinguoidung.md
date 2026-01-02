# Kịch Bản Test - Chức Năng User Behavior Analytics & Recommendations

## 📋 Phân Biệt Trải Nghiệm Theo Loại User

| Tiêu chí | 👤 Guest (Chưa đăng nhập) | 🔐 Client (Đã đăng nhập) |
|----------|---------------------------|--------------------------|
| **Tracking xem sản phẩm** | ❌ Không lưu vào "đã xem gần đây" | ✅ Lưu vào Redis, gắn với userId |
| **Tracking tìm kiếm** | ✅ Tăng counter (anonymous) | ✅ Tăng counter + gắn userId |
| **Sản phẩm xu hướng** | ✅ Hiển thị | ✅ Hiển thị |
| **Đã xem gần đây** | ❌ Không hiển thị | ✅ Hiển thị (nếu có data) |
| **Có thể bạn quan tâm** | ❌ Không hiển thị | ✅ Hiển thị (nếu có history) |
| **Sản phẩm tương tự** | ✅ Hiển thị (ProductDetailPage) | ✅ Hiển thị (ProductDetailPage) |

---

## 🧪 Kịch Bản Test

### Nhóm A: Guest User

| ID | Kịch bản | Bước thực hiện | Kết quả mong đợi |
|----|----------|----------------|------------------|
| A1 | Trang Home không có "Đã xem gần đây" | Mở trang Home (chưa đăng nhập) | KHÔNG thấy section "Đã xem gần đây" |
| A2 | Trang Home không có "Có thể bạn quan tâm" | Mở trang Home (chưa đăng nhập) | KHÔNG thấy section "Có thể bạn quan tâm" |
| A3 | Trang Home có "Sản phẩm xu hướng" | Mở trang Home (chưa đăng nhập) | Thấy section "Sản phẩm xu hướng" với badge 🔥 Hot |
| A4 | ProductDetailPage có "Sản phẩm tương tự" | Mở trang chi tiết sản phẩm bất kỳ | Thấy section "Sản phẩm tương tự" |
| A5 | Search được track | Search "áo thun" | Keyword được tăng counter trong Redis |

### Nhóm B: Logged-in User

| ID | Kịch bản | Bước thực hiện | Kết quả mong đợi |
|----|----------|----------------|------------------|
| B1 | Hiển thị "Đã xem gần đây" | 1. Đăng nhập<br>2. Xem 3 sản phẩm<br>3. Về trang Home | Thấy section "Đã xem gần đây" với 3 sản phẩm vừa xem |
| B2 | Gợi ý cá nhân hóa theo category | 1. Đăng nhập<br>2. Xem sản phẩm thuộc category "Điện thoại"<br>3. Về trang Home | "Có thể bạn quan tâm" hiển thị sản phẩm cùng category với lý do "Vì bạn đã xem [tên SP]" |
| B3 | Sản phẩm xem lại được đẩy lên đầu | 1. Đăng nhập<br>2. Xem SP A, B, C<br>3. Xem lại SP A<br>4. Về trang Home | SP A nằm đầu tiên trong "Đã xem gần đây" |
| B4 | Track thêm giỏ hàng | 1. Đăng nhập<br>2. Thêm sản phẩm vào giỏ hàng | Event ADD_CART được lưu trong MySQL (bảng behavior_logs) |

### Nhóm C: Backend API Testing

| ID | Endpoint | Auth | Lệnh test |
|----|----------|------|-----------|
| C1 | GET /recommendations/trending | ❌ | `curl http://localhost:8082/v1/stock/analytics/recommendations/trending?limit=5` |
| C2 | GET /recommendations/recently-viewed | ✅ | `curl -H "Authorization: Bearer <token>" http://localhost:8082/v1/stock/analytics/recommendations/recently-viewed` |
| C3 | GET /recommendations/personalized | ✅ | `curl -H "Authorization: Bearer <token>" http://localhost:8082/v1/stock/analytics/recommendations/personalized` |
| C4 | GET /recommendations/similar/{id} | ❌ | `curl http://localhost:8082/v1/stock/analytics/recommendations/similar/<productId>` |

---

## ✅ Checklist Hoàn Thành

- [ ] Test tất cả kịch bản nhóm A (Guest)
- [ ] Test tất cả kịch bản nhóm B (Logged-in)
- [ ] Test tất cả API nhóm C (Backend)
- [ ] Screenshot/Video demo
- [ ] Kiểm tra Redis (check keys)
- [ ] Kiểm tra MySQL (check tables)
