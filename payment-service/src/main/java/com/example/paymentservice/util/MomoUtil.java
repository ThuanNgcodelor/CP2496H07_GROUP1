package com.example.paymentservice.util;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

/**
 * Utility class for MoMo payment signature generation and verification.
 * MoMo uses HMAC SHA256 for signature.
 */
public final class MomoUtil {
    
    private MomoUtil() {
    }

    /**
     * Generate HMAC SHA256 signature.
     * @param key Secret key
     * @param data Data to sign
     * @return Hex-encoded signature
     */
    public static String hmacSHA256(String key, String data) {
        try {
            Mac hmac256 = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            hmac256.init(secretKey);
            byte[] result = hmac256.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (Exception e) {
            return "";
        }
    }

    /**
     * Build signature raw data for MoMo payment request.
     * Format: accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl
     *         &orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode
     *         &redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
     */
    public static String buildSignatureRawData(
            String accessKey,
            long amount,
            String extraData,
            String ipnUrl,
            String orderId,
            String orderInfo,
            String partnerCode,
            String redirectUrl,
            String requestId,
            String requestType
    ) {
        return "accessKey=" + accessKey +
                "&amount=" + amount +
                "&extraData=" + extraData +
                "&ipnUrl=" + ipnUrl +
                "&orderId=" + orderId +
                "&orderInfo=" + orderInfo +
                "&partnerCode=" + partnerCode +
                "&redirectUrl=" + redirectUrl +
                "&requestId=" + requestId +
                "&requestType=" + requestType;
    }

    /**
     * Build signature raw data for verifying IPN callback.
     * Format: accessKey=$accessKey&amount=$amount&extraData=$extraData&message=$message
     *         &orderId=$orderId&orderInfo=$orderInfo&orderType=$orderType
     *         &partnerCode=$partnerCode&payType=$payType&requestId=$requestId
     *         &responseTime=$responseTime&resultCode=$resultCode&transId=$transId
     */
    public static String buildIpnSignatureRawData(
            String accessKey,
            long amount,
            String extraData,
            String message,
            String orderId,
            String orderInfo,
            String orderType,
            String partnerCode,
            String payType,
            String requestId,
            long responseTime,
            int resultCode,
            long transId
    ) {
        return "accessKey=" + accessKey +
                "&amount=" + amount +
                "&extraData=" + extraData +
                "&message=" + message +
                "&orderId=" + orderId +
                "&orderInfo=" + orderInfo +
                "&orderType=" + orderType +
                "&partnerCode=" + partnerCode +
                "&payType=" + payType +
                "&requestId=" + requestId +
                "&responseTime=" + responseTime +
                "&resultCode=" + resultCode +
                "&transId=" + transId;
    }
}
