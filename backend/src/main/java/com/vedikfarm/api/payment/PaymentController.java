package com.vedikfarm.api.payment;

import com.vedikfarm.api.common.ApiException;
import com.vedikfarm.api.common.ApiResponse;
import com.vedikfarm.api.order.Order;
import com.vedikfarm.api.order.OrderRepository;
import com.vedikfarm.api.order.OrderService;
import com.vedikfarm.api.payment.dto.VerifyPaymentRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Fast-path confirmation called by the frontend right after Razorpay Checkout.js succeeds.
 * This is for snappy UI feedback ONLY - the webhook (RazorpayWebhookController) is the
 * authoritative source of truth, since a client callback can be spoofed or simply never
 * arrive (tab closed mid-flow, network drop). OrderService.markOrderPaid() is idempotent,
 * so it's safe for both this endpoint and the webhook to call it for the same order.
 */
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final RazorpayService razorpayService;
    private final OrderRepository orderRepository;
    private final OrderService orderService;

    public PaymentController(RazorpayService razorpayService, OrderRepository orderRepository, OrderService orderService) {
        this.razorpayService = razorpayService;
        this.orderRepository = orderRepository;
        this.orderService = orderService;
    }

    @PostMapping("/verify")
    public ApiResponse<String> verify(@Valid @RequestBody VerifyPaymentRequest request) {
        boolean valid = razorpayService.verifyPaymentSignature(
                request.getRazorpayOrderId(), request.getRazorpayPaymentId(), request.getRazorpaySignature());

        if (!valid) {
            throw ApiException.badRequest("Payment verification failed.");
        }

        Order order = orderRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> ApiException.notFound("Order not found"));

        orderService.markOrderPaid(order, request.getRazorpayPaymentId(), request.getRazorpaySignature());
        return ApiResponse.ok("Payment verified", order.getOrderNumber());
    }
}
