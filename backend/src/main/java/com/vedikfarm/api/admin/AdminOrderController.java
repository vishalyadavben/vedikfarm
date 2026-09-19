package com.vedikfarm.api.admin;

import com.vedikfarm.api.admin.dto.UpdateOrderStatusRequest;
import com.vedikfarm.api.common.ApiException;
import com.vedikfarm.api.common.ApiResponse;
import com.vedikfarm.api.order.Order;
import com.vedikfarm.api.order.OrderItemRepository;
import com.vedikfarm.api.order.OrderRepository;
import com.vedikfarm.api.order.dto.OrderResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

/** Everything here is behind ROLE_ADMIN - see SecurityConfig ("/api/admin/**" -> hasRole("ADMIN")). */
@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public AdminOrderController(OrderRepository orderRepository, OrderItemRepository orderItemRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @GetMapping
    public ApiResponse<Page<OrderResponse>> list(@RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "20") int size) {
        var pageable = PageRequest.of(page, Math.min(size, 100));
        return ApiResponse.ok(orderRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(o -> OrderResponse.from(o, orderItemRepository.findByOrderId(o.getId()))));
    }

    @PatchMapping("/{orderNumber}/status")
    public ApiResponse<OrderResponse> updateStatus(@PathVariable String orderNumber,
                                                     @Valid @RequestBody UpdateOrderStatusRequest req) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> ApiException.notFound("Order not found"));
        order.setStatus(req.getStatus());
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);
        return ApiResponse.ok(OrderResponse.from(order, orderItemRepository.findByOrderId(order.getId())));
    }
}
