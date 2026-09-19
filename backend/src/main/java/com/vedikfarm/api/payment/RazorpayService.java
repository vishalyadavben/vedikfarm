package com.vedikfarm.api.payment;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.vedikfarm.api.common.ApiException;
import com.vedikfarm.api.config.RazorpayProperties;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class RazorpayService {

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
            throw ApiException.badRequest("Could not start payment. Please try again.");
        }
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
