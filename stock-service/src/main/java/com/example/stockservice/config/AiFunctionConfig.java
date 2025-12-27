package com.example.stockservice.config;

import com.example.stockservice.service.ai.OrderTools;
import com.example.stockservice.service.ai.ProductTools;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Description;

import java.util.function.Function;

/**
 * Configuration để đăng ký các Function Beans cho Spring AI
 */
@Configuration
public class AiFunctionConfig {

    private final ProductTools productTools;
    private final OrderTools orderTools;

    public AiFunctionConfig(ProductTools productTools, OrderTools orderTools) {
        this.productTools = productTools;
        this.orderTools = orderTools;
    }

    // ============ Product Tools ============
    
    @Bean
    @Description("Search products by name or keyword. Use this when user wants to find products.")
    public Function<ProductTools.SearchRequest, ProductTools.SearchResponse> searchProducts() {
        return productTools.searchProducts();
    }

    @Bean
    @Description("Get price of a specific product by name. Use this when user asks about product price.")
    public Function<ProductTools.PriceRequest, ProductTools.PriceResponse> getProductPrice() {
        return productTools.getProductPrice();
    }

    @Bean
    @Description("Get all products currently on sale or discount. Use this when user asks about discounted products or promotions.")
    public Function<ProductTools.DiscountRequest, ProductTools.DiscountResponse> getDiscountedProducts() {
        return productTools.getDiscountedProducts();
    }

    @Bean
    @Description("Get detailed information of a product by its ID.")
    public Function<ProductTools.ProductDetailRequest, ProductTools.ProductDetailResponse> getProductDetails() {
        return productTools.getProductDetails();
    }
    
    // ============ Order Tools ============
    
    @Bean
    @Description("MUST USE when user asks about orders, my orders, order history, order status, đơn hàng, đơn của tôi, xem đơn, check order. Returns list of user's orders with status. Parameter: userId (string)")
    public Function<OrderTools.GetMyOrdersRequest, OrderTools.GetMyOrdersResponse> getMyOrders() {
        return orderTools.getMyOrders();
    }
    
    @Bean
    @Description("Get details of a specific order by its ID. Use when user provides an order ID to check. Parameter: orderId (string)")
    public Function<OrderTools.GetOrderStatusRequest, OrderTools.GetOrderStatusResponse> getOrderStatus() {
        return orderTools.getOrderStatus();
    }
    
    @Bean
    @Description("Filter orders by payment method. Use when user asks 'đơn VNPAY', 'đơn COD', 'orders paid by VNPAY'. Parameters: userId, paymentMethod (VNPAY/COD/WALLET)")
    public Function<OrderTools.GetOrdersByPaymentRequest, OrderTools.GetOrdersByPaymentResponse> getOrdersByPayment() {
        return orderTools.getOrdersByPayment();
    }
    
    @Bean
    @Description("Calculate spending statistics. Use when user asks 'chi tiêu tháng này', 'tuần này bao nhiêu', 'tổng đã chi', 'total spent'. Parameters: userId, period (week/month/all)")
    public Function<OrderTools.GetSpendingStatsRequest, OrderTools.GetSpendingStatsResponse> getSpendingStats() {
        return orderTools.getSpendingStats();
    }
}

