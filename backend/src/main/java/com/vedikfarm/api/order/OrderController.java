package com.vedikfarm.api.order;

import com.vedikfarm.api.auth.AuthenticatedUser;
import com.vedikfarm.api.common.ApiResponse;
import com.vedikfarm.api.order.dto.CreateOrderRequest;
import com.vedikfarm.api.order.dto.OrderResponse;
import com.vedikfarm.api.order.dto.QuoteResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ApiResponse<OrderResponse> createOrder(@AuthenticationPrincipal AuthenticatedUser user,
                                                   @Valid @RequestBody CreateOrderRequest request) {
        return ApiResponse.ok(orderService.createOrderFromCart(user.getUserId(), request));
    }

    /** Live GST/shipping/total preview for the checkout page - nothing is created or charged. */
    @GetMapping("/quote")
    public ApiResponse<QuoteResponse> previewOrder(@AuthenticationPrincipal AuthenticatedUser user,
                                                    @RequestParam Long addressId) {
        return ApiResponse.ok(orderService.previewOrder(user.getUserId(), addressId));
    }

    @GetMapping
    public ApiResponse<Page<OrderResponse>> listOrders(@AuthenticationPrincipal AuthenticatedUser user,
                                                         @RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "10") int size) {
        var pageable = PageRequest.of(page, Math.min(size, 50), Sort.by("createdAt").descending());
        return ApiResponse.ok(orderService.listOrders(user.getUserId(), pageable));
    }

    @GetMapping("/{orderNumber}")
    public ApiResponse<OrderResponse> getOrder(@AuthenticationPrincipal AuthenticatedUser user,
                                                @PathVariable String orderNumber) {
        return ApiResponse.ok(orderService.getOrder(user.getUserId(), orderNumber));
    }
}
