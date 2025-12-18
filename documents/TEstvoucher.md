# Test Vouchers & Cases (Shop / Platform)

This doc lists ready-to-use vouchers (SQL) and test cases to verify end-to-end flows: validate → apply → order creation (COD/VNPay) → voucher usage log.

---

## Sample Assumptions
- Shops:
  - `SHOP_A`: has subscription `VOUCHER_XTRA` (`voucher_enabled=true`, `commission_voucher_rate=0.05`, `voucher_max_per_item=50000`).
  - `SHOP_B`: has subscription `BOTH` (`freeship_enabled=true`, `voucher_enabled=true`, same rates).
- Products:
  - `P1` (ShopA) price `100000`
  - `P2` (ShopA) price `600000`
  - `P3` (ShopB) price `400000`

Adjust IDs to your real data.

---

## SQL: Shop Vouchers (for ShopOwner)

### 1) HEHE10 – 10% off, max 50k, min order 100k (all products)
```sql
INSERT INTO shop_vouchers (
    id, shop_owner_id, code, title, description,
    discount_type, discount_value, max_discount_amount,
    min_order_value, start_at, end_at,
    quantity_total, quantity_used, status, applicable_scope
) VALUES (
    'HEHE-10P',
    'SHOP_A',
    'HEHE10',
    'Giảm 10% tối đa 50k',
    'Voucher test giảm 10%, tối đa 50k',
    'PERCENT',
    10.00,
    50000,
    100000,
    NOW(),
    DATE_ADD(NOW(), INTERVAL 7 DAY),
    100,
    0,
    'ACTIVE',
    'ALL_PRODUCTS'
);
```

### 2) FIX30K – fixed 30k, min order 200k, only product P2
```sql
INSERT INTO shop_vouchers (
    id, shop_owner_id, code, title, description,
    discount_type, discount_value, max_discount_amount,
    min_order_value, start_at, end_at,
    quantity_total, quantity_used, status, applicable_scope
) VALUES (
    'FIX30K-P2',
    'SHOP_A',
    'FIX30K',
    'Giảm 30k cho P2',
    'Giảm cố định 30k cho sản phẩm P2',
    'FIXED',
    30000,
    30000,
    200000,
    NOW(),
    DATE_ADD(NOW(), INTERVAL 7 DAY),
    50,
    0,
    'ACTIVE',
    'SELECTED_PRODUCTS'
);

-- Map voucher FIX30K to product P2
INSERT INTO voucher_applicability (
    id, voucher_id, voucher_type, product_id, category_id
) VALUES (
    'VA-FIX30K-P2',
    'FIX30K-P2',
    'SHOP',
    'P2',
    NULL
);
```

---

## SQL: Platform Voucher

### PLAT20K – fixed 20k off, min order 300k (platform-wide)
```sql
INSERT INTO platform_vouchers (
    id, code, title, description,
    discount_type, discount_value, max_discount_amount,
    min_order_value, start_at, end_at,
    quantity_total, quantity_used, status
) VALUES (
    'PLAT-20K',
    'PLAT20K',
    'Giảm 20k toàn sàn',
    'Giảm 20k cho đơn từ 300k',
    'FIXED',
    20000,
    20000,
    300000,
    NOW(),
    DATE_ADD(NOW(), INTERVAL 7 DAY),
    500,
    0,
    'ACTIVE'
);
```

---

## Test Cases (Manual / Integration)

1) **HEHE10 valid** (ShopA, VOUCHER_XTRA)  
   - Items: P1 (100k), ship 20k → orderAmount=100k.  
   - Validate `/validate?code=HEHE10&shopOwnerId=SHOP_A&orderAmount=100000`  
   - Expect: valid=true, discount=10k, totalPrice ≈ 100k + 20k - 10k = 110k.  
   - After COMPLETED: `voucher_usage` row, `quantity_used`++.

2) **HEHE10 min-order fail**  
   - Items: P1 (80k), ship 20k, orderAmount=80k.  
   - Expect: valid=false, message “chưa đạt giá trị tối thiểu 100000đ”.

3) **HEHE10 hit max 50k cap**  
   - Items: P2 (600k), ship 30k, orderAmount=600k.  
   - Expect: discount=50k (10% of 600k is 60k but capped 50k).  
   - totalPrice ≈ 600k + 30k - 50k = 580k.

4) **FIX30K only for P2**  
   - Items: P1 (100k) + P2 (600k), ship 20k, orderAmount=700k.  
   - Scope SELECTED_PRODUCTS → discount=30k (if P2 present & min_order 200k met).  
   - totalPrice ≈ 700k + 20k - 30k = 690k.

5) **Platform PLAT20K** (needs platform validate endpoint)  
   - Any shop, subtotal=350k, ship=25k.  
   - Expect: discount=20k, totalPrice ≈ 350k + 25k - 20k = 355k.  
   - `voucher_usage.voucher_type = PLATFORM`.

---

## Unit Test Hints

### Discount calc (ShopVoucher)
```java
// expected: 10% of 100k = 10k (<50k cap)
BigDecimal discount = voucherService.validateShopVoucher(
    "HEHE10", "SHOP_A", BigDecimal.valueOf(100_000)
).getDiscount();
assertEquals(BigDecimal.valueOf(10_000), discount);
```

### Commission calc (Voucher Xtra, no freeship)
- commissionPayment = gross*4%, commissionFixed = gross*4%, commissionVoucher = min(gross*5%, 50k).
- net = gross - (payment+fixed+voucher); finalBalance = net - shipping (if no freeship).

Use the formulas from `PAYOUT_LEDGER_SYSTEM.md` to assert `commissionVoucher` and `finalBalance`.

---

## Notes
- Ensure shop has active `ShopSubscription` with `voucher_enabled=true` (and `freeship_enabled` if BOTH).
- Platform voucher flow needs its own validate endpoint (`voucher_type=PLATFORM`) and to set `VoucherUsage.voucher_type=PLATFORM`.
- Adjust IDs (`SHOP_A`, `P1`, …) to real data in your environment.

