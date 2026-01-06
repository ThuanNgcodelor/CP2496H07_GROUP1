# Integration Options - AI Chat vào ChatBot

## Tình hình hiện tại

File `ChatBotWidget.jsx` hiện tại:
- **1400+ dòng code**
- Có nhiều logic phức tạp (WebSocket, conversations, messages...)
- JSX structure rất nested

## Phương án 1: Keep Separate (Đơn giản - 5 phút)

✅ **Ưu điểm:**
- Không risk breaking existing chat
- Dễ maintain
- Quick to implement

**Implementation:**
- Giữ ChatBotWidget hiện tại
- Giữ AIChatWidget hiện tại  
- Adjust CSS để 2 FAB buttons gần nhau hơn

**Code:**
```css
/* ChatBotWidget FAB */
.shopee-chat-fab {
    bottom: 170px; /* Moved up */
    right: 24px;
}

/* AIChatWidget FAB */
.ai-chat-fab {
    bottom: 100px; /* Below shop chat */
    right: 24px;
}
```

---

## Phương án 2: Tabs Inside (Phức tạp - 30-60 phút)

**Cần làm:**
1. Refactor ChatBotWidget structure
2. Extract shop chat content to separate component
3. Add tab switching logic
4. Import và integrate AIChatWidget content
5. Test thoroughly

**Risks:**
- Có thể break existing WebSocket logic
- Có thể break conversation loading
- Cần test kỹ tất cả scenarios

---

## Phương án 3: UnifiedChatWidget (Moderate - 15 phút)

**Như đã tạo trước đó:**
- Tạo wrapper component mới
- ChatBotWidget và AIChatWidget làm children
- Tabs ở wrapper level

**Implementation:**
```jsx
<UnifiedChatWidget>
  <ChatBotWidget embedded />
  <AIChatWidget embedded />
</UnifiedChatWidget>
```

---

## Khuyến nghị

**Phương án 1** - vì:
- Safe, không break existing code
- Quick to implement  
- User vẫn có 2 chat options
- Dễ rollback nếu có problem

Bạn chọn phương án nào?
