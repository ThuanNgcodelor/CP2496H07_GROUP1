# 🔍 Debug Guide - Contextual AI Product Suggestions

## Vấn đề hiện tại
AI trả lời: "couldn't find any matching products" → Function được gọi nhưng **KHÔNG TÌM THẤY PRODUCTS**

---

## ✅ Checklist để debug

### 1. **Kiểm tra Stock Service đã restart chưa?**
```bash
# Restart service để apply code mới
cd stock-service
mvn clean package -DskipTests
java -jar target/stock-service.jar
```

### 2. **Kiểm tra Database có products không?**
Mở MySQL/PostgreSQL và chạy:
```sql
-- Xem tất cả products
SELECT id, name, status FROM products LIMIT 20;

-- Tìm products có từ "áo", "quần", "giày"
SELECT name FROM products WHERE name LIKE '%áo%' OR name LIKE '%quần%' OR name LIKE '%giày%';

-- Tìm products có từ tiếng Anh
SELECT name FROM products WHERE 
  name LIKE '%shirt%' OR 
  name LIKE '%dress%' OR 
  name LIKE '%shoes%' OR
  name LIKE '%hat%';
```

### 3. **Xem logs của Stock Service**
Sau khi test "I want to go beach", check console logs:
```
🔍 AI requesting product suggestions for scenario: swimsuit,sunglasses,sunscreen,hat
📝 Parsed keywords: [swimsuit, sunglasses, sunscreen, hat]
🔎 Searching for keyword: 'swimsuit'
✅ Found 0 products for keyword 'swimsuit'  ← NẾU = 0 → Database không có
🔎 Searching for keyword: 'sunglasses'
✅ Found 0 products for keyword 'sunglasses'
...
📊 Total products found (before dedup): 0
🎯 Final result: 0 products
```

---

## 🎯 Giải pháp dựa vào logs

### Nếu logs show "Found 0 products for ALL keywords"
→ **Database không có products match**

**Giải pháp:**
1. Thêm products vào database với tên phù hợp
2. Hoặc test với keywords khác (tiếng Việt)

**Test với tiếng Việt:**
- User: "Tôi muốn đi biển"
- AI sẽ search: "đồ bơi", "kính râm", "kem chống nắng", "nón"

### Nếu logs show "Found X products" nhưng AI vẫn báo "not found"
→ **Vấn đề ở response handling**

**Check:**
- `SuggestionResponse` có được serialize đúng không?
- AI có nhận được products từ function không?

---

## 🧪 Test Cases

### Test 1: Tiếng Việt (Dễ hơn nếu DB có products VN)
```
User: Tôi muốn đi biển
Expected search: đồ bơi, kính râm, kem chống nắng, nón
```

### Test 2: Tiếng Anh
```
User: I want to go beach
Expected search: swimsuit, sunglasses, sunscreen, hat
```

### Test 3: Generic search
```
User: Tìm áo
Expected: Direct search "áo"
```

---

## 📝 Sample Products cần thêm (nếu DB trống)

```sql
INSERT INTO products (id, name, description, price, status) VALUES
('p1', 'Áo thun nam', 'Áo thun cotton', 150000, 'IN_STOCK'),
('p2', 'Quần jean nữ', 'Quần jean skinny', 350000, 'IN_STOCK'),
('p3', 'Giày thể thao', 'Giày chạy bộ', 500000, 'IN_STOCK'),
('p4', 'Kính râm', 'Kính chống UV', 200000, 'IN_STOCK'),
('p5', 'Nón lưỡi trai', 'Nón snapback', 100000, 'IN_STOCK');
```

---

## 🚀 Next Steps

1. ✅ Restart Stock Service với code mới (có logs chi tiết)
2. ✅ Test: "I want to go beach"
3. ✅ Check logs → Xem keyword nào được search
4. ✅ Check DB → Có products match không?
5. ✅ Report lại kết quả logs

**Sau khi có logs, chúng ta sẽ biết chính xác vấn đề ở đâu!**
