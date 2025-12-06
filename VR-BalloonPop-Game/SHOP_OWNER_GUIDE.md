# 🚀 Quick Start Guide - VR Event System for Shop Owners

## Overview
Hệ thống cho phép bạn (chủ shop) tổ chức sự kiện VR gaming tại cửa hàng. Khách chơi game, đạt điểm cao → nhận voucher → mua hàng.

---

## ✅ Checklist Setup

### Bước 1: Chuẩn bị phần cứng
- [ ] Mua **Meta Quest 3** (hoặc Quest 2) - Giá ~10-12 triệu/chiếc
- [ ] Mua **router WiFi 5GHz** (nếu shop chưa có WiFi tốt)
- [ ] Chuẩn bị **màn hình/TV** để hiển thị live stream (optional)
- [ ] Chuẩn bị **không gian chơi**: 2x2m, sạch sẽ, an toàn

### Bước 2: Đăng ký kính VR trên hệ thống
- [ ] Login vào shop dashboard: `shopee-fake.id.vn/shop/devices`
- [ ] Click **"Thêm kính VR"**
- [ ] Nhập **Serial Number** (trên hộp kính)
- [ ] Hệ thống tạo **mã kích hoạt 6 số** (VD: 123456)
- [ ] Đeo kính VR → Mở app → Nhập mã → Kính được liên kết

### Bước 3: Tạo sự kiện
- [ ] Vào `shopee-fake.id.vn/shop/events`
- [ ] Click **"Tạo sự kiện mới"**
- [ ] Điền thông tin:
  - Tên sự kiện: "Flash Sale Gaming Day"
  - Ngày giờ: 01/01/2025, 9:00 AM - 5:00 PM
  - Số người tối đa: 50
  - Voucher thưởng:
    - 100-499 điểm → Voucher 5k
    - 500-999 điểm → Voucher 20k
    - 1000+ điểm → Voucher 50k
- [ ] **In QR code** (hoặc hiển thị trên tablet)

### Bước 4: Ngày sự kiện
- [ ] Dán QR code ở cửa shop
- [ ] Mở web dashboard: `shopee-fake.id.vn/shop/events/[event-id]`
- [ ] Màn hình sẽ hiển thị:
  - Live stream từ kính VR
  - Bảng xếp hạng real-time
  - Số người đang chơi
- [ ] Nhân viên hướng dẫn khách:
  1. Quét QR → Đăng nhập
  2. Đeo kính VR
  3. Chơi game 60 giây
  4. Nhận voucher (nếu đủ điểm)

---

## 📱 Hướng dẫn khách hàng

### Khi khách đến shop:

**1. Quét QR Code**
```
Khách dùng điện thoại quét QR
  ↓
Mở trang web check-in
  ↓
Login/Đăng ký (nếu chưa có tài khoản)
  ↓
Nhận session token: "ABC123"
```

**2. Nhân viên hỗ trợ**
```
- Giúp khách đeo kính VR
- Hướng dẫn cách chơi (30 giây)
- Nhập token "ABC123" vào VR (hoặc khách tự nhập)
- Game tự động bắt đầu
```

**3. Chơi game**
```
Game: Fruit Ninja VR - chém sản phẩm Shopee
Thời gian: 60 giây
Mục tiêu: Đạt càng nhiều điểm càng tốt
```

**4. Nhận voucher**
```
Kết thúc game → Điểm hiển thị trên kính VR
Nếu đủ điểm → Voucher SMS gửi về điện thoại
Khách có thể dùng voucher ngay lập tức
```

---

## 🖥️ Web Dashboard Features

### Giao diện cho shop owner:

```
┌─────────────────────────────────────────┐
│ Event: Flash Sale Gaming Day            │
│ Status: ● LIVE     Players: 12/50       │
├─────────────────────────────────────────┤
│ ┌────────┐  ┌──────────────────────┐   │
│ │QR Code │  │ Live Stream VR       │   │
│ │[Image] │  │ [Video player]       │   │
│ │        │  │ Player: Nguyễn A     │   │
│ │        │  │ Score: 1,250 pts     │   │
│ └────────┘  └──────────────────────┘   │
│                                         │
│ 🏆 Leaderboard (Real-time)             │
│ 1. Nguyễn A  - 1,250 pts - Voucher 50k │
│ 2. Trần B    - 1,100 pts - Voucher 50k │
│ 3. Lê C      -   950 pts - Voucher 20k │
│                                         │
│ [End Event] [Export Results] [Stats]   │
└─────────────────────────────────────────┘
```

---

## 💰 Chi phí ước tính

### One-time costs:
- Meta Quest 3: **10,000,000 VND** x số kính
- WiFi router tốt: **1,500,000 VND**
- TV/màn hình (optional): **5,000,000 VND**

### Recurring costs:
- Software: **FREE** (platform không tính phí)
- Voucher rewards: **Tùy shop quyết định**

### ROI Example:
```
Giả sử:
- 1 sự kiện: 50 người chơi
- 30 người nhận voucher 20k
- 15 người dùng voucher mua hàng (AOV = 200k)

Chi phí voucher: 30 x 20,000 = 600,000 VND
Doanh thu: 15 x 200,000 = 3,000,000 VND
Lợi nhuận (margin 20%): 600,000 VND
→ Hòa vốn với voucher + tăng traffic + brand awareness
```

---

## 🔒 An toàn & Bảo mật

### Chống mất/hỏng kính:
1. **Khu vực có rào chắn**: Chơi trong không gian giới hạn
2. **Nhân viên giám sát**: 1 nhân viên cho 2-3 kính
3. **GPS tracking**: Kính tự động báo nếu rời khỏi shop
4. **Heartbeat check**: Kính báo cáo vị trí mỗi 5 phút

### Vệ sinh:
- Lau kính VR bằng khăn khử trùng sau mỗi lượt chơi
- Thay mút đệm thường xuyên

---

## 📊 Thống kê & Báo cáo

Sau mỗi sự kiện, shop owner nhận:
- Số người tham gia
- Tổng voucher phát ra
- Tỷ lệ sử dụng voucher
- Top players
- Thời gian chơi trung bình
- Headset battery usage

**Export Excel** để phân tích ROI.

---

## ❓ FAQ

**Q: Khách có thể chơi nhiều lần không?**  
A: Tùy shop quyết định. Có thể giới hạn 1 lần/ngày/người.

**Q: Nếu kính hết pin giữa chừng?**  
A: Dashboard cảnh báo khi pin < 20%. Nên sạc trước sự kiện.

**Q: Lúc đông khách phải xếp hàng?**  
A: Có. Dashboard hiển thị "Queue: 5 people". Khách thấy thứ tự.

**Q: Nếu WiFi shop yếu?**  
A: Game chạy offline trên kính, chỉ cần WiFi để:
- Gửi điểm về server
- Stream lên web (optional)

**Q: Có thể tùy chỉnh game?**  
A: Có. Shop owner chọn:
- Sản phẩm nào xuất hiện trong game
- Độ khó (easy/medium/hard)
- Thời gian chơi (30s/60s/90s)

---

## 🚀 Next Steps

1. ✅ Xác nhận tham gia beta test
2. ⏳ Đợi platform hoàn thiện (9-10 tuần)
3. 📦 Nhận training kit + VR app
4. 🎉 Tổ chức sự kiện đầu tiên!

**Liên hệ support:** support@shopee-fake.id.vn
