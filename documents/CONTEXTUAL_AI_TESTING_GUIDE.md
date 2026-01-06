# ✅ Testing Guide - Contextual Product Suggestions

Bạn đã hoàn thành implementation! Hãy test để đảm bảo mọi thứ hoạt động đúng.

---

## 🧪 Test Cases

### ✅ Test 1: Contextual Suggestion (Beach Scenario)

**Input trong chat**:
```
Tuần sau tôi đi biển, cần chuẩn bị gì?
```

**Expected Result**:
1. AI trả lời text: "Đây là một số sản phẩm phù hợp cho chuyến đi biển..."
2. Xuất hiện **horizontal carousel** với 4-6 sản phẩm
3. Products có image, name, price
4. Có button "Xem chi tiết" trên mỗi card
5. Carousel có thể scroll ngang
6. Click vào button → Navigate đến product detail page

---

### ✅ Test 2: Existing Features Still Work (Orders)

**Input**:
```
Đơn hàng của tôi ở đâu?
```

**Expected Result**:
1. AI gọi function `getMyOrders()` như cũ
2. Hiển thị danh sách đơn hàng với UUID clickable
3. **KHÔNG có** product carousel
4. Click Order ID → Navigate đến tracking page

---

### ✅ Test 3: Existing Features Still Work (Search)

**Input**:
```
Tìm sản phẩm áo thun nam
```

**Expected Result**:
1. AI gọi function `searchProducts(keyword="áo thun nam")`
2. Hiển thị kết quả search dưới dạng text/list
3. **MAY OR MAY NOT** có carousel (tùy AI decide)

---

### ✅ Test 4: General Chat (No Products)

**Input**:
```
Hôm nay thứ mấy?
```

**Expected Result**:
1. AI trả lời: "Hôm nay là Thứ Hai..."
2. **KHÔNG có** product carousel
3. Chat hoạt động bình thường

---

## 🐛 Troubleshooting

### Problem 1: Carousel không hiển thị

**Check**:
1. Mở DevTools Console, xem có log `suggestedProducts`?
2. Check response từ API: `response.suggestedProducts` có data không?
3. Check trong `AIChatService.java`:
   - `suggestProductsByScenario` đã được add vào `defaultFunctions()`?
   - System prompt có hướng dẫn AI gọi tool này?

**Debug**:
```javascript
console.log('Response:', response);
console.log('Suggested Products:', response.suggestedProducts);
```

---

### Problem 2: Carousel hiển thị nhưng không scroll được

**Check CSS**:
- `.ai-carousel-wrapper` phải có `overflow-x: auto`
- `.ai-product-card` phải có `min-width` và `max-width`

**Fix**: Thêm vào `.ai-carousel-wrapper`:
```css
overflow-x: auto;
-webkit-overflow-scrolling: touch; /* For iOS */
```

---

### Problem 3: AI không tự động gọi tool

**Check Backend**:
1. Kiểm tra `AIChatService.java` constructor:
```java
.defaultFunctions(
    ...
    "suggestProductsByScenario"  // <-- Dòng này phải có
)
```

2. Kiểm tra System Prompt có mention tool:
```
- "đi biển/party/gym" → suggestProductsByScenario(scenario="...")
```

3. Restart backend service

---

### Problem 4: Click button "Xem chi tiết" bị lỗi

**Check**:
- `product.id` có tồn tại không?
- Route `/product/:id` đã được define?

**Debug**:
```jsx
onClick={() => {
    console.log('Product ID:', product.id);
    navigate(`/product/${product.id}`);
}}
```

---

## 📸 Screenshots Expected

### Before (Current)
```
User: "Tôi muốn đi biển"
AI: "Đây là một số sản phẩm..."
```

### After (With Carousel)
```
User: "Tôi muốn đi biển"
AI: "Đây là một số sản phẩm phù hợp cho chuyến đi biển:"
┌─────────┬─────────┬─────────┬─────────┐
│ [Image] │ [Image] │ [Image] │ [Image] │
│ Đồ bơi  │ Kính    │ Kem     │ Nón     │
│ 299k    │ 150k    │ 99k     │ 79k     │
│ [Button]│ [Button]│ [Button]│ [Button]│
└─────────┴─────────┴─────────┴─────────┘
       ← scrollable →
```

---

## ✅ Final Checklist

- [ ] Backend: `ContextualSuggestTool.java` đã tạo
- [ ] Backend: `ProductSuggestionDto.java` đã tạo
- [ ] Backend: `AIChatResponse.java` có field `suggestedProducts`
- [ ] Backend: `AIChatService` constructor có `suggestProductsByScenario`
- [ ] Backend: System Prompt có hướng dẫn tool
- [ ] Frontend: `ProductCard` component đã thêm
- [ ] Frontend: `renderMessageContent` có render carousel
- [ ] CSS: Carousel styling đã thêm
- [ ] Test: "Đi biển" → Hiện carousel
- [ ] Test: "Đơn hàng" → KHÔNG hiện carousel
- [ ] Test: Click product → Navigate OK

---

## 🎉 Success Criteria

Khi test case 1 pass (hiện carousel khi hỏi về đi biển), bạn đã hoàn thành xong feature!

**Next Steps**:
- Test thêm với các scenarios khác: "đi party", "đi gym", "đi du lịch"
- Fine-tune keywords trong `ContextualSuggestTool` nếu cần
- (Optional) Thêm loading state cho carousel

---

**Happy Testing! 🚀**
