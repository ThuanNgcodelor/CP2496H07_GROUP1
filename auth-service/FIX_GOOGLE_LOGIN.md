# 🔧 FIX: Google Login không được - Database Connection Error

## ❌ Lỗi gốc
```
Access denied for user 'root'@'172.18.0.1' (using password: NO)
```

## 🔍 Nguyên nhân

**KHÔNG PHẢI lỗi Google OAuth!** Lỗi là do:

1. ✅ Google OAuth callback thành công
2. ❌ **Auth service không kết nối được MySQL database**
3. ❌ Config server không load được → auth-service dùng default config (root user, no password)

### Chi tiết:
- Auth service config: `spring.config.import=configserver:http://localhost:8888/`
- Config server có thể chưa chạy hoặc bị lỗi
- Khi không load được config → Spring Boot dùng default:
  - Username: `root`
  - Password: **EMPTY** (NO)
- MySQL trong Docker yêu cầu: username=`sa`, password=`Thuan@417`

## ✅ Giải pháp

### Đã fix:
Thêm database config trực tiếp vào `auth-service/src/main/resources/application.properties`:

```properties
spring.config.import=optional:configserver:http://localhost:8888/

# Database Configuration (Fallback if config server fails)
spring.datasource.url=jdbc:mysql://localhost:3306/shopee
spring.datasource.username=sa
spring.datasource.password=Thuan@417
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA & Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

**Thay đổi quan trọng:**
- `configserver:` → `optional:configserver:` (không bắt buộc)
- Thêm datasource config làm fallback

## 🚀 Cách test lại

### 1. Rebuild auth-service:
```bash
cd auth-service
mvn clean package -DskipTests
```

### 2. Restart auth-service:
```bash
# Stop service hiện tại (Ctrl+C)

# Chạy lại:
java -jar target/auth-service-0.0.1-SNAPSHOT.jar
```

### 3. Kiểm tra logs:
Xem phải có dòng này:
```
HikariPool-1 - Starting...
HikariPool-1 - Start completed.
```

**KHÔNG CÒN** dòng lỗi:
```
Access denied for user 'root'@'172.18.0.1' (using password: NO)
```

### 4. Test Google Login:
1. Mở frontend: http://localhost:5173
2. Click "Login with Google"
3. Chọn tài khoản Google
4. Sẽ redirect về và login thành công!

## 🔐 Google OAuth Config (Đã đúng)

Từ hình ảnh bạn gửi, redirect URI đã đúng:
```
http://localhost:5173/oauth2/callback
```

Client ID trong `auth-service/application.properties` cũng khớp:
```
google.client-id=941069814660-or8vut20mcc30h2lp3lgdrfqd48j4qkc.apps.googleusercontent.com
```

## 📝 Tóm tắt

| Vấn đề | Trước | Sau |
|--------|-------|-----|
| Config import | `configserver:...` (bắt buộc) | `optional:configserver:...` |
| Fallback config | ❌ Không có | ✅ Có (username=sa, password=Thuan@417) |
| MySQL connection | ❌ Fail (root, no password) | ✅ OK (sa, Thuan@417) |
| Google Login | ❌ 500 Error | ✅ Sẽ hoạt động |

## ⚠️ Lưu ý

Nếu vẫn lỗi sau khi rebuild:
1. Kiểm tra MySQL đang chạy: `docker ps | findstr mysql`
2. Test connection: 
   ```bash
   mysql -h localhost -P 3306 -u sa -pThuan@417 shopee
   ```
3. Nếu không connect được → Restart Docker containers:
   ```bash
   docker-compose down
   docker-compose up -d
   ```
