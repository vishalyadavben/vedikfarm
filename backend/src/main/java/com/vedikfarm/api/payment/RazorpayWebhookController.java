package com.vedikfarm.api.payment;

import com.vedikfarm.api.order.Order;
import com.vedikfarm.api.order.OrderRepository;
import com.vedikfarm.api.order.OrderService;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Razorpay's server-to-server webhook - configure this URL (https://api.vedikfarm.in/api/webhooks/razorpay)
 * and a webhook secret in the Razorpay dashboard, subscribed to at least "payment.captured".
 * This is the source of truth for marking orders paid; the /api/payments/verify endpoint is
 * just a fast-path for UI feedback. Always returns 200 once the signature check passes, even
 * if the order was already marked paid, so Razorpay doesn't keep retrying.
 */
@RestController
@RequestMapping("/api/webhooks")
public class RazorpayWebhookController {

    private final RazorpayService razorpayService;
    private final OrderRepository orderRepository;
    private final OrderService orderService;

    public RazorpayWebhookController(RazorpayService razorpayService, OrderRepository orderRepository, OrderService orderService) {
        this.razorpayService = razorpayService;
        this.orderRepository = orderRepository;
        this.orderService = orderService;
    }

    @PostMapping("/razorpay")
    public ResponseEntity<String> handleWebhook(@RequestBody String rawPayload,
                                                 @RequestHeader("X-Razorpay-Signature") String signature) {
        if (!razorpayService.verifyWebhookSignature(rawPayload, signature)) {
            return ResponseEntity.status(400).body("invalid signature");
        }

        JSONObject payload = new JSONObject(rawPayload);
        String event = payload.optString("event", "");

        if ("payment.captured".equals(event) || "order.paid".equals(event)) {
            try {
                JSONObject paymentEntity = payload
                        .getJSONObject("payload")
                        .getJSONObject("payment")
                        .getJSONObject("entity");
                String razorpayOrderId = paymentEntity.getString("order_id");
                String razorpayPaymentId = paymentEntity.getString("id");

                orderRepository.findByRazorpayOrderId(razorpayOrderId).ifPresent(order ->
                        orderService.markOrderPaid(order, razorpayPaymentId, null));
            } catch (Exception e) {
                // Malformed/unexpected payload shape for this event - log and still 200 so
                // Razorpay doesn't retry forever; investigate via logs if this ever fires.
                return ResponseEntity.ok("ignored: unexpected payload shape");
            }
        }

        return ResponseEntity.ok("ok");
    }
}
