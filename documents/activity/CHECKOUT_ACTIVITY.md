# Activity Diagrams - Checkout System

Tài liệu mô tả Activity Diagram cho hệ thống Checkout với các phương thức COD, VNPAY, MOMO.

---

## 1. Checkout COD (Thanh Toán Khi Nhận Hàng)

```mermaid
flowchart TD
    Start([Start]) --> SelectItems[User chọn sản phẩm từ giỏ]
    
    subgraph Client["👤 CLIENT"]
        SelectItems --> SelectAddress[Chọn địa chỉ giao hàng]
        SelectAddress --> SelectCOD[Chọn phương thức COD]
        SelectCOD --> ReviewOrder[Xem lại đơn hàng]
        ReviewOrder --> ClickOrder[Click Đặt hàng]
        ShowSuccess[Hiển thị đặt hàng thành công]
        ShowSuccess --> NavigateOrders[Chuyển trang đơn hàng]
    end
    
    subgraph System["🖥️ SYSTEM"]
        ClickOrder --> ValidateOrder{Đơn hàng hợp lệ?}
        ValidateOrder -->|No| ReturnError[Trả về lỗi]
        ValidateOrder -->|Yes| CheckStock{Còn hàng?}
        CheckStock -->|No| ErrStock[Lỗi: Hết hàng]
        CheckStock -->|Yes| PublishKafka[Publish order event]
        PublishKafka --> ReturnProcessing[Trả về đang xử lý]
        ReturnProcessing --> ShowSuccess
    end
    
    subgraph Async["📨 ASYNC"]
        PublishKafka -.-> ConsumeOrder[Consumer nhận order]
        ConsumeOrder --> CalcShipping[Tính phí ship GHN]
        CalcShipping --> CreateOrder[Tạo đơn hàng PENDING]
        CreateOrder --> DecreaseStock[Giảm tồn kho]
        DecreaseStock --> ClearCart[Xóa items khỏi giỏ]
        ClearCart --> SendNotif[Gửi thông báo Shop Owner]
    end
    
    ReturnError --> EndErr([End])
    ErrStock --> EndErr
    NavigateOrders --> EndOK([End])
    SendNotif -.-> EndAsync([End])
    
    style Client fill:#e6f3ff
    style System fill:#fff5e6
    style Async fill:#e6ffe6
```

---

## 2. Checkout VNPAY (Thanh Toán Online)

```mermaid
flowchart TD
    Start([Start]) --> SelectVNPAY[User chọn VNPAY]
    
    subgraph Client["👤 CLIENT"]
        SelectVNPAY --> ClickOrder[Click Đặt hàng]
        RedirectVNPAY[Chuyển sang trang VNPAY]
        ReturnFromVNPAY[Quay về từ VNPAY]
        ReturnFromVNPAY --> CheckResult{Thanh toán OK?}
        CheckResult -->|No| ShowFailed[Hiển thị thất bại]
        CheckResult -->|Yes| ShowSuccess[Hiển thị thành công]
        ShowSuccess --> NavigateOrders[Chuyển trang đơn hàng]
    end
    
    subgraph System["🖥️ SYSTEM"]
        ClickOrder --> CreatePayment[Tạo payment PENDING]
        CreatePayment --> BuildURL[Tạo URL thanh toán VNPAY]
        BuildURL --> RedirectVNPAY
        ReturnFromVNPAY --> VerifyPayment{Xác thực chữ ký?}
        VerifyPayment -->|No| MarkFailed[Đánh dấu thất bại]
        MarkFailed --> ShowFailed
        VerifyPayment -->|Yes| MarkPaid[Đánh dấu đã thanh toán]
        MarkPaid --> CreateOrder[Tạo đơn hàng CONFIRMED]
        CreateOrder --> DecreaseStock[Giảm tồn kho]
        DecreaseStock --> ClearCart[Xóa items khỏi giỏ]
        ClearCart --> ShowSuccess
    end
    
    subgraph External["🌐 VNPAY"]
        RedirectVNPAY --> VNPAYPage[Trang thanh toán VNPAY]
        VNPAYPage --> UserPay[User nhập thẻ/banking]
        UserPay --> ProcessPay[Xử lý thanh toán]
        ProcessPay --> RedirectBack[Redirect về website]
        RedirectBack --> ReturnFromVNPAY
    end
    
    ShowFailed --> EndFail([End])
    NavigateOrders --> EndOK([End])
    
    style Client fill:#e6f3ff
    style System fill:#fff5e6
    style External fill:#ffe6e6
```

---

## 3. Checkout MOMO (Thanh Toán Ví MoMo)

```mermaid
flowchart TD
    Start([Start]) --> SelectMOMO[User chọn MOMO]
    
    subgraph Client["👤 CLIENT"]
        SelectMOMO --> ClickOrder[Click Đặt hàng]
        RedirectMOMO[Chuyển sang app/web MOMO]
        ReturnFromMOMO[Quay về từ MOMO]
        ReturnFromMOMO --> CheckResult{Thanh toán OK?}
        CheckResult -->|No| ShowFailed[Hiển thị thất bại]
        CheckResult -->|Yes| ShowSuccess[Hiển thị thành công]
        ShowSuccess --> NavigateOrders[Chuyển trang đơn hàng]
    end
    
    subgraph System["🖥️ SYSTEM"]
        ClickOrder --> CreatePayment[Tạo payment PENDING]
        CreatePayment --> BuildURL[Tạo URL thanh toán MOMO]
        BuildURL --> RedirectMOMO
        IPNCallback[Nhận IPN từ MOMO] --> VerifyIPN{Xác thực?}
        VerifyIPN -->|No| IgnoreIPN[Bỏ qua]
        VerifyIPN -->|Yes| MarkPaid[Đánh dấu đã thanh toán]
        MarkPaid --> CreateOrder[Tạo đơn hàng CONFIRMED]
        CreateOrder --> DecreaseStock[Giảm tồn kho]
        DecreaseStock --> ClearCart[Xóa items khỏi giỏ]
    end
    
    subgraph External["🌐 MOMO"]
        RedirectMOMO --> MOMOPage[Trang thanh toán MOMO]
        MOMOPage --> UserPay[User xác nhận thanh toán]
        UserPay --> ProcessPay[Xử lý thanh toán]
        ProcessPay --> SendIPN[Gửi IPN callback]
        SendIPN --> IPNCallback
        ProcessPay --> RedirectBack[Redirect về website]
        RedirectBack --> ReturnFromMOMO
    end
    
    ShowFailed --> EndFail([End])
    NavigateOrders --> EndOK([End])
    IgnoreIPN --> EndIgnore([End])
    
    style Client fill:#e6f3ff
    style System fill:#fff5e6
    style External fill:#ffe6e6
```

---

## 4. So Sánh Các Luồng Checkout

| Đặc Điểm | COD | VNPAY | MOMO |
|----------|-----|-------|------|
| **Luồng** | Đặt hàng → Ship → Trả tiền | Trả tiền → Đặt hàng | Trả tiền → Đặt hàng |
| **Xử lý Order** | Async qua Kafka | Sync sau thanh toán | Sync sau IPN |
| **Status ban đầu** | PENDING | CONFIRMED | CONFIRMED |
| **Callback** | ❌ | Return URL | ✅ IPN Callback |

---

## 5. Tổng Quan Kiến Trúc

```mermaid
flowchart TB
    subgraph Client["👤 CLIENT"]
        Checkout[CheckoutPage]
    end
    
    subgraph System["🖥️ SYSTEM"]
        OS[OrderService]
        PS[PaymentService]
        K[Kafka]
    end
    
    subgraph External["🌐 EXTERNAL"]
        VNPAY[VNPAY]
        MOMO[MOMO]
        GHN[GHN API]
    end
    
    Checkout -->|COD| OS
    OS --> K
    K -.-> OS
    OS --> GHN
    Checkout -->|VNPAY| PS
    PS <--> VNPAY
    Checkout -->|MOMO| PS
    PS <--> MOMO
    PS --> OS
    
    style Client fill:#e6f3ff
    style System fill:#fff5e6
    style External fill:#ffe6e6
```
