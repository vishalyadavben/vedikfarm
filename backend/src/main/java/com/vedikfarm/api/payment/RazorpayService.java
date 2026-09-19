package com.vedikfarm.api.payment;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.vedikfarm.api.common.ApiException;
import com.vedikfarm.api.config.RazorpayProperties;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class RazorpayService {

    private static final Logger log = LoggerFactory.getLogger(RazorpayService.class);

    private final RazorpayProperties props;

    public RazorpayService(RazorpayProperties props) {
        this.props = props;
    }

    private RazorpayClient client() {
        try {
            return new RazorpayClient(props.getKeyId(), props.getKeySecret());
        } catch (RazorpayException e) {
            throw new IllegalStateException("Could not initialize Razorpay client - check RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET", e);
        }
    }

    /** Creates a Razorpay order for the given total (in rupees). Returns the Razorpay order id. */
    public String createOrder(String receipt, BigDecimal totalRupees) {
        if (isBlank(props.getKeyId()) || isBlank(props.getKeySecret())) {
            // The single most common cause of "checkout doesn't work" during setup: RAZORPAY_KEY_ID/
            // RAZORPAY_KEY_SECRET are still blank in .env. This does NOT require completed KYC to fix -
            // Razorpay's Test Mode API keys (Settings > API Keys in the Razorpay dashboard) work immediately
            // after signup and are free to use for as much test-mode checkout as you like.
            log.error("Cannot create Razorpay order - RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET are not set in the backend's environment.");
            throw ApiException.badRequest(
                    "Payments aren't set up yet. Add your Razorpay Test Mode API keys (RAZORPAY_KEY_ID and "
                    + "RAZORPAY_KEY_SECRET in the backend .env, plus VITE_RAZORPAY_KEY_ID in the frontend .env) "
                    + "and restart the backend - this doesn't require completing Razorpay KYC.");
        }

        try {
            int amountInPaise = totalRupees.multiply(BigDecimal.valueOf(100)).intValueExact();
            JSONObject request = new JSONObject();
            request.put("amount", amountInPaise);
            request.put("currency", "INR");
            request.put("receipt", receipt);
            request.put("payment_capture", true);

            var order = client().orders.create(request);
            return order.get("id");
        } catch (RazorpayException e) {
            // Logged in full server-side so the real cause (bad key, wrong currency, Razorpay API being
            // unreachable, etc.) is visible in `docker compose logs backend` - the customer-facing message
            // stays generic on purpose so we don't leak API error details to the browser.
            log.error("Razorpay order creation failed: {}", e.getMessage(), e);
            throw ApiException.badRequest("Could not start payment. Please try again in a moment.");
        }
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }

    /** Verifies the signature sent back by the Razorpay Checkout.js client callback. */
    public boolean verifyPaymentSignature(String razorpayOrderId, String razorpayPaymentId, String signature) {
        try {
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", razorpayOrderId);
            attributes.put("razorpay_payment_id", razorpayPaymentId);
            attributes.put("razorpay_signature", signature);
            return Utils.verifyPaymentSignature(attributes, props.getKeySecret());
        } catch (RazorpayException e) {
            return false;
        }
    }

    /** Verifies a webhook request signature (uses the separate webhook secret, not the API key secret). */
    public boolean verifyWebhookSignature(String payload, String signatureHeader) {
        try {
            return Utils.verifyWebhookSignature(payload, signatureHeader, props.getWebhookSecret());
        } catch (RazorpayException e) {
            return false;
        }
    }

    public String getKeyId() {
        return props.getKeyId();
    }
}
