# ĐÁNH GIÁ HẠ TẦNG: 8 CORE - 16GB RAM (LINUX + DOCKER)

## 1. Nhận định chung
Đây là cấu hình **"Điểm Ngọt" (Sweet Spot)** cho một hệ thống Microservices tầm trung chạy All-in-one.

* **OS Linux:** Là lựa chọn tuyệt vời. Linux Server (không giao diện) chỉ tốn khoảng **500MB - 800MB RAM**, để dành trọn tài nguyên cho ứng dụng.
* **Docker:** Quản lý việc triển khai gọn gàng, nhưng cần cấu hình giới hạn tài nguyên (Resource Limits) cẩn thận.
* **8 Cores:** Dư thừa sức mạnh tính toán.
* **16 GB RAM:** Đủ không gian để các service "thở" thoải mái mà không dẫm đạp lên nhau.

---

## 2. Bảng phân bổ RAM chi tiết (Memory Allocation Plan)

Tổng tài nguyên khả dụng: **16,384 MB (16GB)**.
Mục tiêu: Chạy 9 Java Services + MySQL + Kafka + Redis.

| Thành phần | Số lượng | RAM Dự kiến (Tối thiểu - Tối đa) | Tổng cộng | Đánh giá |
| :--- | :--- | :--- | :--- | :--- |
| **Linux OS & Docker Daemon** | 1 | 800 MB - 1 GB | **1 GB** | Rất nhẹ |
| **MySQL (Database)** | 1 | 2 GB - 4 GB | **3 GB** | Cần set `innodb_buffer_pool_size` hợp lý |
| **Kafka + Zookeeper** | 1 set | 1 GB - 1.5 GB | **1.5 GB** | Java app, khá tốn RAM |
| **Redis** | 1 | 256 MB - 512 MB | **0.5 GB** | Cache metadata, user session |
| **Heavy Services** (Order, Stock) | 2 | 800 MB - 1.2 GB | **2.4 GB** | Logic nặng, nhiều object |
| **Medium Services** (User, Payment, Noti) | 3 | 512 MB - 800 MB | **2.4 GB** | Logic vừa phải |
| **Light Services** (Gateway, Eureka, Config, File) | 4 | 256 MB - 512 MB | **2 GB** | Chỉ forward request |
| **Dư phòng (Free/Buffer)** | - | - | **~3.2 GB** | **QUAN TRỌNG** |

👉 **KẾT LUẬN:** Bạn còn dư khoảng **3GB RAM**. Đây là con số vàng. Nó giúp hệ thống:
1.  Không bao giờ bị lỗi `OOM Killed` (Out Of Memory).
2.  Linux dùng phần dư này để làm **Disk Cache**, giúp Database đọc ghi nhanh hơn.

---

## 3. Khả năng chịu tải 5.000 Concurrent Users

Với cấu hình này, câu trả lời là: **RẤT KHẢ THI (VỚI ĐIỀU KIỆN).**

### Điều kiện là gì?
1.  **5.000 User "Active" vs 5.000 User "Bấm nút cùng 1 giây":**
    * Nếu 5.000 người đang lướt web, xem hàng, và thỉnh thoảng 500-1000 người bấm mua hàng cùng lúc: **Server này CÂN TỐT.**
    * Nếu đúng 5.000 người cùng bấm nút "Thanh toán" ở chính xác giây thứ 0 (ví dụ Flash Sale): **Nút thắt cổ chai sẽ chuyển từ RAM sang Ổ Cứng (Disk I/O).**

2.  **Vấn đề Ổ cứng (Disk I/O) - Điểm yếu tiềm ẩn:**
    * Bạn đang chạy MySQL (ghi đơn hàng), Kafka (ghi log message), Redis (snapshot) và Log ứng dụng trên cùng 1 ổ cứng.
    * Nếu ổ cứng là **SSD NVMe**: Ngon, chịu tốt.
    * Nếu ổ cứng là **HDD** hoặc SSD thường: Hệ thống sẽ bị chậm do nghẽn cổ chai ghi đĩa, dù CPU và RAM vẫn rảnh.

---

## 4. Hướng dẫn cấu hình Docker Compose tối ưu

Để đảm bảo hệ thống chạy mượt trên 16GB RAM, bạn **phải** giới hạn RAM trong file `docker-compose.yml`. Đừng để mặc định (Java sẽ cố lấy hết RAM).

Ví dụ cấu hình mẫu:

```yaml
services:
  # --- INFRASTRUCTURE ---
  mysql:
    image: mysql:8.0
    deploy:
      resources:
        limits:
          memory: 3G  # Giới hạn MySQL không được ăn quá 3GB

  kafka:
    image: confluentinc/cp-kafka
    environment:
      KAFKA_HEAP_OPTS: "-Xmx1G -Xms1G" # Bắt buộc set Heap cho Kafka
    deploy:
      resources:
        limits:
          memory: 1.5G

  # --- MICROSERVICES ---
  order-service:
    image: order-service:latest
    environment:
      # Cấu hình Java Heap bên trong container
      JAVA_TOOL_OPTIONS: "-Xms512m -Xmx1024m"
    deploy:
      resources:
        limits:
          memory: 1.2G # Docker sẽ kill nếu vượt quá 1.2GB

  user-service:
    image: user-service:latest
    environment:
      JAVA_TOOL_OPTIONS: "-Xms256m -Xmx768m"
    deploy:
      resources:
        limits:
          memory: 1G

  api-gateway:
    image: api-gateway:latest
    environment:
      JAVA_TOOL_OPTIONS: "-Xms256m -Xmx512m"
    deploy:
      resources:
        limits:
          memory: 600M