# System Analysis & Documentation

## Overview
This document outlines the data models, API endpoints, and system architecture for the recently implemented ShopCoin, Advertisement, and Review functionalities.

## 1. Data Models

### User Service (`user-service`)

#### 1.1 `ShopCoin`
**Purpose:** Stores the ShopCoin balance and daily check-in status for each user.
**Table:** `shop_coins`

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key (inherited from BaseEntity) |
| `userId` | String | ID of the user owning the coins |
| `points` | Long | Current balance of ShopCoins |
| `checkInDate` | LocalDate | Date of the check-in record |
| `isCheckedInToday` | Boolean | Flag indicating if user checked in today |
| `consecutiveDays` | Integer | Count of consecutive check-in days (for streak bonuses) |
| `lastCheckInDate` | LocalDate | Date of the last successful check-in |
| `lastViewProductDate` | LocalDate | Date of last product view mission |
| `lastReviewMissionDate` | LocalDate | Date of last product review mission |

#### 1.2 `Advertisement`
**Purpose:** Manages advertisement campaigns created by Shop Owners.
**Table:** `advertisements`

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key (inherited from BaseEntity) |
| `shopId` | String | ID of the shop creating the ad |
| `title` | String | Title of the campaign |
| `description` | String | Detailed description |
| `adType` | String | Type of ad (e.g., "BANNER", "POPUP") |
| `imageUrl` | String | URL of the ad image |
| `targetUrl` | String | Destination URL when clicked |
| `durationDays` | Integer | Requested duration in days |
| `status` | Enum | `PENDING`, `active`, `REJECTED`, `EXPIRED`, `PAUSED` |
| `placement` | String | Ad position (e.g., "HEADER", "POPUP") |
| `startDate` | LocalDateTime| When the ad became active |
| `endDate` | LocalDateTime | When the ad expires |
| `rejectionReason`| String | Reason if ad was rejected by admin |

---

### Stock Service (`stock-service`)

#### 1.3 `Review`
**Purpose:** Stores product reviews submitted by users.
**Table:** `reviews`

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String | Primary Key (UUID) |
| `userId` | String | ID of the reviewer |
| `productId` | String | ID of the product being reviewed |
| `rating` | int | Star rating (1-5) |
| `comment` | String | Text content of the review |
| `imageIds` | List<String>| List of image IDs attached to the review |
| `reply` | String | Shop owner's reply to the review |
| `repliedAt` | LocalDateTime| Timestamp of the reply |
| `createdAt` | LocalDateTime| Timestamp of review creation |

---

## 2. API Endpoints

### User Service (`http://localhost:8002`)
**Base Path for ShopCoin:** `/v1/shop-coin`
**Base Path for Ads:** `/v1/user/ads`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/v1/shop-coin/my-coins` | Get current user's coin balance |
| **GET** | `/v1/shop-coin/check-in-status`| Check if user checked in today |
| **POST** | `/v1/shop-coin/daily-check-in` | Perform daily check-in to earn coins |
| **POST** | `/v1/shop-coin/mission/review-completion` | (Internal) Award coins for completing a review |
| **GET** | `/v1/user/ads/active` | Get list of active ads (can filter by `placement`) |
| **POST** | `/v1/user/ads/request` | Submit a new ad request (Shop Owner) |
| **PUT** | `/v1/user/ads/{id}/approve` | Approve an ad request (Admin) |
| **PUT** | `/v1/user/ads/{id}/reject` | Reject an ad request (Admin) |

### Stock Service (`http://localhost:8006` - Estimated)
**Base Path:** `/v1/stock/reviews`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/v1/stock/reviews` | Create a new product review (Triggers ShopCoin mission) |
| **GET** | `/v1/stock/reviews/product/{productId}` | Get all reviews for a specific product |
| **GET** | `/v1/stock/reviews/shop/{shopId}` | Get all reviews for a specific shop |
| **POST** | `/v1/stock/reviews/{reviewId}/reply` | Shop owner replies to a review |
| **GET** | `/v1/stock/reviews/check-today/{userId}` | Check if user has reviewed any product today |

## 3. System Architecture Highlights

### Cross-Service Communication
The system uses **Feign Clients** for synchronous inter-service communication:
*   **Flow:** `Stock Service` -> `User Service`
*   **Trigger:** When a user submits a review via `ReviewController`.
*   **Action:** `ReviewService` calls `ShopCoinClient.completeReviewMission()`.
*   **Result:** `User Service` receives the request, verifies logic, and updates the user's `ShopCoin` balance.

### Gateway & Security
*   **API Gateway (Port 8080):** Handles routing and deduplicates CORS headers to prevent browser errors.
*   **CORS:** Enabled in `User Service` (Port 8002) to allow direct frontend access if needed.
*   **Strategy:** Dual-channel support (Gateway-mediated or Direct) ensures robust availability for critical features like Coins and Ads.

## 4. Phân Tích Chức Năng & Chi Tiết Thay Đổi (Function Analysis & File Changes)

Phần này mô tả chi tiết các thay đổi trong từng file code để thực hiện các chức năng mới.

### 4.1 Hệ Thống Shop Coin (Xu)
**Mục tiêu:** Cho phép người dùng kiếm Xu qua điểm danh, nhiệm vụ và quản lý số dư.

| Thành phần | Đường dẫn file | Chi tiết thay đổi |
| :--- | :--- | :--- |
| **Backend API** | `user-service/.../ShopCoinController.java` | **Thêm mới:** Endpoint `/mission/review-completion` để nhận tín hiệu hoàn thành review từ Stock Service.<br>**Thêm mới:** Endpoint `/daily-check-in` xử lý logic cộng điểm danh tiếp, kiểm tra chuỗi ngày liên tiếp (streak). |
| **Backend Logic** | `user-service/.../model/ShopCoin.java` | **Định nghĩa:** Tạo Entity mới ánh xạ bảng `shop_coins` với các trường `points` (số dư), `checkInDate`, `consecutiveDays` (số ngày liên tiếp). Thêm các method helper như `recordCheckIn()` để xử lý logic ngày tháng. |
| **Frontend API** | `my-app/src/api/shopCoin/shopCoinAPI.js` | **Chỉnh sửa:** Cập nhật `baseURL` trỏ đúng về cổng 8002 (hoặc qua Gateway).<br>**Thêm mới:** Các hàm `permissionCheckIn`, `getMyShopCoins` để gọi Backend. |
| **Frontend UI** | `my-app/src/components/client/userPage/User.jsx` | **Thêm mới UI:** Khu vực hiển thị số dư Xu, nút "Điểm danh hàng ngày".<br>**Logic:** Tự động kiểm tra trạng thái điểm danh khi trang tải (`useEffect`), hiển thị modal chúc mừng khi nhận Xu thành công. |

### 4.2 Hệ Thống Quảng Cáo (Advertisement)
**Mục tiêu:** Shop Owner đăng ký quảng cáo, Admin duyệt, và hiển thị ưu tiên trên trang chủ.

| Thành phần | Đường dẫn file | Chi tiết thay đổi |
| :--- | :--- | :--- |
| **Backend API** | `user-service/.../AdvertisementController.java` | **Tạo mới:** Controller hoàn toàn mới. Cung cấp API `GET /active` (lấy quảng cáo đang chạy), `POST /request` (đăng ký mới), `PUT /approve` & `/reject` (Admin duyệt). |
| **Backend Logic** | `user-service/.../model/Advertisement.java` | **Định nghĩa:** Entity quản lý thông tin quảng cáo: `imageUrl`, `targetUrl`, `status` (PENDING, ACTIVE...), `placement` (Vị trí hiển thị), `durationDays`. |
| **Frontend UI** | `my-app/src/components/client/ShopeeBanner.jsx` | **Sửa logic Fetch:** Gọi song song API lấy Banner hệ thống và API lấy Quảng cáo (`adAPI.getActiveAds`), sau đó trộn Quảng cáo vào đầu danh sách hiển thị.<br>**Sửa giao diện:** Thêm 2 nút mũi tên (Next/Prev) đè lên banner.<br>**Sửa tương tác:** Thêm `onMouseEnter` để tạm dừng banner khi di chuột. Tách hàm `handleBannerClick` để tracking ngầm không chặn việc chuyển link. |
| **Frontend API** | `my-app/src/api/ads/adAPI.js` | **Tạo mới:** File API riêng biệt cho quảng cáo, định nghĩa các hàm gọi về `user-service`. |
| **Frontend Logic**| `my-app/src/components/client/ads/AdDisplay.jsx` | **Logic Popup:** Thêm kiểm tra `sessionStorage` để đảm bảo Popup quảng cáo chỉ hiện **1 lần duy nhất** trong mỗi phiên làm việc của trình duyệt. |

### 4.3 Tích Hợp Đánh Giá & Nhiệm Vụ (Review Integration)
**Mục tiêu:** Tự động tặng xu khi người dùng đánh giá sản phẩm.

| Thành phần | Đường dẫn file | Chi tiết thay đổi |
| :--- | :--- | :--- |
| **Backend API** | `stock-service/.../ReviewController.java` | **Sửa logic:** Trong hàm `createReview`, sau khi lưu review vào DB thành công, gọi tiếp sang Service để kích hoạt nhiệm vụ. |
| **Backend Service**| `stock-service/.../ReviewService.java` | **Inject Client:** Tiêm (Inject) `ShopCoinClient` vào service.<br>**Thực thi:** Gọi `shopCoinClient.completeReviewMission()` trong khối `try-catch` để đảm bảo nếu lỗi cộng xu thì cũng không làm lỗi việc lưu đánh giá. |
| **Kết nối** | `stock-service/.../client/ShopCoinClient.java` | **Tạo mới:** Feign Client Interface. Định nghĩa cách gọi sang User Service (`@FeignClient(name="user-service")`), map đúng đường dẫn API nhận thưởng. |

### 4.4 Hạ Tầng & Bảo Mật (Infrastructure)
**Mục tiêu:** Đảm bảo hệ thống chạy ổn định, fix lỗi kết nối mạng (CORS).

| Thành phần | Đường dẫn file | Chi tiết thay đổi |
| :--- | :--- | :--- |
| **Gateway** | `gateway/.../config/GatewayConfig.java` | **Thêm Route:** Cấu hình đường dẫn `/v1/shop-coin/**` trỏ về User Service.<br>**Sửa lỗi Double CORS:** Thêm filter `DedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_UNIQUE")` vào toàn bộ các route trỏ về User Service. Giúp loại bỏ header thừa gây lỗi trình duyệt. |
| **Bảo mật** | `user-service/.../config/SecurityConfig.java` | **Bật lại CORS:** Thêm cấu hình `CorsConfigurationSource` cho phép các nguồn (`localhost:5173`) được gọi trực tiếp vào Service (cổng 8002). Điều này cần thiết vì một số API ShopCoin cũ đang gọi thẳng vào Service thay vì qua Gateway. |
