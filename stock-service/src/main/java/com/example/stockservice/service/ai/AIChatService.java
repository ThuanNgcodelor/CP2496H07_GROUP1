package com.example.stockservice.service.ai;

import com.example.stockservice.dto.AIChatRequest;
import com.example.stockservice.dto.AIChatResponse;
import com.example.stockservice.dto.ProductSuggestionDto;
import com.example.stockservice.service.product.ProductService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
@ConditionalOnClass(name = "org.springframework.ai.chat.model.ChatModel")
public class AIChatService {

    private final ChatClient chatClient;
    private final LanguageFilter languageFilter;
    private final ProductService productService;

    // Lưu conversation history (conversationId -> list of messages)
    private final Map<String, List<ChatMessage>> conversationHistory = new ConcurrentHashMap<>();

    // Record để lưu message
    private record ChatMessage(String role, String content) {
    }

    private static final String SYSTEM_PROMPT = """
            ROLE:
            Bạn là VIBE AI, trợ lý mua sắm thông minh của VIBE E-commerce.
            Bạn thân thiện, hữu ích và chuyên nghiệp.

            CONTEXT:
            - Thời gian hiện tại: {current_time}
            - Ngày: {current_date} ({day_of_week})
            - Ngôn ngữ ưu tiên: {language}
            - User ID: {user_id}

            CẢNH BÁO QUAN TRỌNG - ĐỌC KỸ

            BẠN TUYỆT ĐỐI KHÔNG ĐƯỢC TỰ BỊA DỮ LIỆU!
            BẠN BẮT BUỘC PHẢI GỌI TOOL VÀ COPY CHÍNH XÁC KẾT QUẢ!

            AVAILABLE TOOLS VÀ CÁCH DÙNG:

            PRODUCT TOOLS:
            - "tìm sản phẩm X" → searchProducts(keyword="X")
            - "giá sản phẩm X" → getProductPrice(productName="X")
            - "sản phẩm giảm giá" → getDiscountedProducts()
            
            CONTEXTUAL SUGGESTIONS (TỰ ĐỘNG GỌI):
            Khi user đề cập đến hoạt động/scenario, BẠN PHẢI TỰ ĐỘNG GỌI suggestProductsByScenario:
            
            Vietnamese:
            - "đi biển" / "ra biển" / "beach" → suggestProductsByScenario(scenario="đồ bơi,kính râm,kem chống nắng,nón")
            - "đi party" / "tiệc" → suggestProductsByScenario(scenario="váy,áo,giày cao gót,trang sức")
            - "đi gym" / "tập gym" → suggestProductsByScenario(scenario="quần thể thao,áo thể thao,giày thể thao")
            - "đi du lịch" → suggestProductsByScenario(scenario="ba lô,mũ,kem chống nắng,túi xách")
            
            English:
            - "go to beach" / "going beach" / "beach trip" → suggestProductsByScenario(scenario="swimsuit,sunglasses,sunscreen,hat")
            - "party" / "go to party" → suggestProductsByScenario(scenario="dress,shoes,jewelry,accessories")
            - "gym" / "workout" → suggestProductsByScenario(scenario="sports wear,sneakers,sports bra")
            - "travel" / "trip" → suggestProductsByScenario(scenario="backpack,hat,sunscreen,travel bag")
            
            QUAN TRỌNG: 
            - KHÔNG HỎI LẠI USER, TỰ ĐỘNG GỌI FUNCTION NGAY!
            - Extract keywords phù hợp với scenario
            - Tool sẽ trả về products, bạn chỉ cần hiển thị
            
            ORDER TOOLS:
            - "đơn hàng của tôi" → getMyOrders(userId="{user_id}")
            - "đơn VNPAY/COD" → getOrdersByPayment(userId="{user_id}", paymentMethod="VNPAY" hoặc "COD")
            - "chi tiêu tháng này" → getSpendingStats(userId="{user_id}", period="month")
            - "chi tiêu tuần này" → getSpendingStats(userId="{user_id}", period="week")
            - "tổng đã chi" → getSpendingStats(userId="{user_id}", period="all")

            QUAN TRỌNG: Message từ tool đã được format sẵn, bạn CHỈ CẦN COPY và hiển thị.
            KHÔNG ĐƯỢC thêm, bớt, hoặc thay đổi dữ liệu từ tool.

            QUY TẮC NGÔN NGỮ:
            - Tiếng Việt → trả lời tiếng Việt
            - English → reply in English
            - KHÔNG dùng tiếng Trung, Nhật, Hàn

            {conversation_history}
            """;

    public AIChatService(ChatModel chatModel, LanguageFilter languageFilter, ProductTools productTools, ProductService productService) {
        this.languageFilter = languageFilter;

        // Build ChatClient với các tools (Product + Order)
        this.chatClient = ChatClient.builder(chatModel)
                .defaultFunctions(
                        // Product tools
                        "searchProducts",
                        "getProductPrice",
                        "getDiscountedProducts",
                        "getProductDetails",
                        // Order tools
                        "getMyOrders",
                        "getOrderStatus",
                        "getOrdersByPayment",
                        "getSpendingStats",
                        "suggestProductsByScenario")
                .build();
        this.productService = productService;
    }

    public AIChatResponse chat(AIChatRequest request) {
        try {
            String userMessage = request.getMessage();

            // 1. Check blocked languages
            if (languageFilter.containsBlockedLanguage(userMessage)) {
                boolean isVi = languageFilter.isVietnamese(userMessage);
                return AIChatResponse.builder()
                        .message(languageFilter.getBlockedLanguageError(isVi))
                        .type("error")
                        .success(false)
                        .error("BLOCKED_LANGUAGE")
                        .build();
            }

            // 2. Determine language
            boolean isVietnamese = languageFilter.isVietnamese(userMessage);
            String language = isVietnamese ? "Tiếng Việt" : "English";

            // 3. Get or create conversation ID
            String conversationId = request.getConversationId();
            if (conversationId == null || conversationId.isEmpty()) {
                conversationId = UUID.randomUUID().toString();
            }

            // 4. Build context with time
            LocalDateTime now = LocalDateTime.now();
            String currentTime = now.format(DateTimeFormatter.ofPattern("HH:mm"));
            String currentDate = now.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            String dayOfWeek = now.format(DateTimeFormatter.ofPattern("EEEE", new Locale("vi", "VN")));

            // 5. Get conversation history
            List<ChatMessage> history = conversationHistory.computeIfAbsent(
                    conversationId, k -> new ArrayList<>());

            // Build history string for prompt
            StringBuilder historyBuilder = new StringBuilder();
            if (!history.isEmpty()) {
                historyBuilder.append("\nLỊCH SỬ HỘI THOẠI:\n");
                // Keep last 6 messages for context
                int startIdx = Math.max(0, history.size() - 6);
                for (int i = startIdx; i < history.size(); i++) {
                    ChatMessage msg = history.get(i);
                    if ("user".equals(msg.role())) {
                        historyBuilder.append("User: ").append(msg.content()).append("\n");
                    } else {
                        historyBuilder.append("AI: ").append(msg.content()).append("\n");
                    }
                }
            }

            // 6. Get userId from request
            String userId = request.getUserId();
            if (userId == null)
                userId = "not_logged_in";

            String systemPrompt = SYSTEM_PROMPT
                    .replace("{current_time}", currentTime)
                    .replace("{current_date}", currentDate)
                    .replace("{day_of_week}", dayOfWeek)
                    .replace("{language}", language)
                    .replace("{user_id}", userId)
                    .replace("{conversation_history}", historyBuilder.toString());

            log.info("Processing: '{}' (ConvId: {}, UserId: {}, History: {} msgs)",
                    userMessage, conversationId.substring(0, 8), userId, history.size());

            // 6. Call AI with Function Calling
            String aiResponse = chatClient.prompt()
                    .system(systemPrompt)
                    .user(userMessage)
                    .call()
                    .content();

            // 7. Filter blocked language from response
            if (aiResponse != null) {
                aiResponse = languageFilter.filterBlockedLanguage(aiResponse);
            }

            // 8. Save to history
            history.add(new ChatMessage("user", userMessage));
            history.add(new ChatMessage("assistant", aiResponse));

            // Keep history size manageable (max 20 messages)
            while (history.size() > 20) {
                history.removeFirst();
            }

            log.info("AI Response: {}", aiResponse);

            // 9. Check if contextual products were suggested (stored in ThreadLocal by tool)
            List<ProductSuggestionDto> productSuggestions = ContextualSuggestTool.getLastProducts();
            
            if (productSuggestions != null && !productSuggestions.isEmpty()) {
                log.info("✅ Retrieved {} product suggestions from ThreadLocal", productSuggestions.size());
                return AIChatResponse.builder()
                        .message(aiResponse)
                        .conversationId(conversationId)
                        .type("products")
                        .productSuggestions(productSuggestions)
                        .success(true)
                        .build();
            }

            return AIChatResponse.builder()
                    .message(aiResponse)
                    .conversationId(conversationId)
                    .type("text")
                    .success(true)
                    .build();

        } catch (Exception e) {
            log.error("Error in AI chat: ", e);
            ContextualSuggestTool.getLastProducts(); // Clean up ThreadLocal
            return AIChatResponse.builder()
                    .message("Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.")
                    .type("error")
                    .success(false)
                    .error(e.getMessage())
                    .build();
        }
    }

    public void clearConversation(String conversationId) {
        conversationHistory.remove(conversationId);
        log.info("Cleared conversation: {}", conversationId);
    }
    
    /**
     * Simple helper to extract value from JSON string
     * Format: "key":"value"
     */
    private String extractJsonValue(String json, String key) {
        String searchKey = "\"" + key + "\":\"";
        int startIdx = json.indexOf(searchKey);
        if (startIdx == -1) {
            // Try without quotes for number values
            searchKey = "\"" + key + "\":";
            startIdx = json.indexOf(searchKey);
            if (startIdx == -1) return null;
            startIdx += searchKey.length();
            int endIdx = json.indexOf(",", startIdx);
            if (endIdx == -1) endIdx = json.indexOf("}", startIdx);
            if (endIdx == -1) return null;
            return json.substring(startIdx, endIdx).trim();
        }
        startIdx += searchKey.length();
        int endIdx = json.indexOf("\"", startIdx);
        if (endIdx == -1) return null;
        return json.substring(startIdx, endIdx);
    }
}
