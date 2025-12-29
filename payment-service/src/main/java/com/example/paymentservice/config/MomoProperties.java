package com.example.paymentservice.config;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Getter
@Setter
@Validated
@ConfigurationProperties(prefix = "momo")
public class MomoProperties {

    /**
     * Partner code được MoMo cấp.
     */
    @NotBlank
    private String partnerCode;

    /**
     * Access key cho API.
     */
    @NotBlank
    private String accessKey;

    /**
     * Secret key để tạo chữ ký HMAC SHA256.
     */
    @NotBlank
    private String secretKey;

    /**
     * URL API tạo thanh toán (sandbox/prod).
     */
    @NotBlank
    private String apiUrl;

    /**
     * URL redirect sau khi thanh toán thành công.
     */
    @NotBlank
    private String returnUrl;

    /**
     * URL nhận IPN callback từ MoMo.
     */
    @NotBlank
    private String ipnUrl;
}
