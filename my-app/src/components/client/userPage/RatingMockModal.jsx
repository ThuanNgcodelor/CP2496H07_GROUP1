import Swal from "sweetalert2";

/**
 * Opens a Shopee-like mock rating modal.
 * @param {'view'|'rate'} mode - 'view' shows read view; 'rate' shows submit view.
 */
export function openRatingMockModal(mode = "view") {
  const isView = mode === "view";
  const title = isView ? "Order Rating (mock)" : "Đánh giá sản phẩm (mock)";
  const confirmText = isView ? "OK (mock)" : "Submit (mock)";

  Swal.fire({
    title,
    width: 720,
    html: `
      <div style="text-align:left;font-size:13px;color:#222;">
        <div style="background:#fff7e6;border:1px solid #ffd591;padding:10px 12px;border-radius:4px;margin-bottom:12px;color:#b46900;font-size:12px;">
          Chia sẻ cảm nhận của bạn về tất cả sản phẩm trong đơn hàng để nhận Shopee Xu (mock).
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:12px;">
          <div style="width:64px;height:64px;border:1px solid #f0f0f0;border-radius:4px;overflow:hidden;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:#fafafa;">
            <i class="fa fa-image" style="color:#ccc;font-size:24px;"></i>
          </div>
          <div style="flex:1;">
            <div style="font-weight:600;margin-bottom:6px;">Tên sản phẩm (mock)</div>
            <div style="color:#999;font-size:12px;margin-bottom:6px;">Mua từ: Mock Shop</div>
            <div style="display:flex;gap:6px;color:#facc15;font-size:20px;margin-bottom:10px;">★★★★★</div>
            <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
              ${[
                "Chất lượng tuyệt vời",
                "Đóng gói đẹp",
                "Giao hàng nhanh",
                "Shop phục vụ tốt",
                "Rất đáng tiền",
              ]
                .map(
                  (t) =>
                    `<span style="border:1px solid #ddd;padding:6px 10px;border-radius:20px;font-size:12px;background:#f9f9f9;">${t}</span>`
                )
                .join("")}
            </div>
            <textarea style="width:100%;min-height:96px;padding:10px;border:1px solid #ddd;border-radius:4px;font-size:13px;" placeholder="Hãy chia sẻ cảm nhận của bạn (mock)"></textarea>
            <div style="display:flex;align-items:center;gap:8px;margin-top:10px;color:#999;font-size:12px;">
              <div style="width:40px;height:40px;border:1px dashed #ddd;border-radius:4px;display:flex;align-items:center;justify-content:center;">
                <i class="fa fa-plus"></i>
              </div>
              <span>Thêm tối đa 5 hình & 1 video để nhận Shopee Xu (mock)</span>
            </div>
          </div>
        </div>
      </div>
    `,
    confirmButtonText: confirmText,
    confirmButtonColor: "#ee4d2d",
    showCancelButton: true,
    cancelButtonText: "Close",
    focusConfirm: false,
  });
}

