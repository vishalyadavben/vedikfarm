package com.vedikfarm.api.order;

import com.vedikfarm.api.cart.CartItem;
import com.vedikfarm.api.cart.CartItemRepository;
import com.vedikfarm.api.catalog.Product;
import com.vedikfarm.api.catalog.ProductRepository;
import com.vedikfarm.api.common.ApiException;
import com.vedikfarm.api.config.SellerProperties;
import com.vedikfarm.api.config.ShippingProperties;
import com.vedikfarm.api.notification.OrderMailService;
import com.vedikfarm.api.order.dto.CreateOrderRequest;
import com.vedikfarm.api.order.dto.OrderResponse;
import com.vedikfarm.api.payment.RazorpayService;
import com.vedikfarm.api.user.Address;
import com.vedikfarm.api.user.AddressRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final AddressRepository addressRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final RazorpayService razorpayService;
    private final SellerProperties sellerProperties;
    private final ShippingProperties shippingProperties;
    private final OrderMailService orderMailService;

    public OrderService(CartItemRepository cartItemRepository, ProductRepository productRepository,
                         AddressRepository addressRepository, OrderRepository orderRepository,
                         OrderItemRepository orderItemRepository, RazorpayService razorpayService,
                         SellerProperties sellerProperties, ShippingProperties shippingProperties,
                         OrderMailService orderMailService) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.addressRepository = addressRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.razorpayService = razorpayService;
        this.sellerProperties = sellerProperties;
        this.shippingProperties = shippingProperties;
        this.orderMailService = orderMailService;
    }

    /**
     * Creates a PENDING_PAYMENT order snapshotting the current cart + a Razorpay order to pay it.
     * Stock is validated here but NOT decremented yet - it's only decremented once payment is
     * confirmed (by the client callback or, authoritatively, the webhook), so an abandoned
     * checkout never locks up inventory.
     */
    @Transactional
    public OrderResponse createOrderFromCart(Long userId, CreateOrderRequest request) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw ApiException.badRequest("Your cart is empty.");
        }

        Address address = addressRepository.findById(request.getAddressId())
                .filter(a -> a.getUserId().equals(userId))
                .orElseThrow(() -> ApiException.notFound("Address not found"));

        Map<Long, Product> productsById = productRepository.findAllById(
                cartItems.stream().map(CartItem::getProductId).toList()
        ).stream().collect(Collectors.toMap(Product::getId, p -> p));

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalGst = BigDecimal.ZERO;
        List<OrderItem> orderItems = new java.util.ArrayList<>();

        for (CartItem ci : cartItems) {
            Product product = productsById.get(ci.getProductId());
            if (product == null || !product.isActive()) {
                throw ApiException.badRequest("An item in your cart is no longer available. Please review your cart.");
            }
            if (ci.getQuantity() > product.getStockQty()) {
                throw ApiException.badRequest("Only " + product.getStockQty() + " left in stock for " + product.getName());
            }

            BigDecimal lineSubtotal = product.getPrice().multiply(BigDecimal.valueOf(ci.getQuantity()))
                    .setScale(2, RoundingMode.HALF_UP);
            BigDecimal lineGst = lineSubtotal.multiply(product.getGstRate())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            BigDecimal lineTotal = lineSubtotal.add(lineGst);

            subtotal = subtotal.add(lineSubtotal);
            totalGst = totalGst.add(lineGst);

            OrderItem oi = new OrderItem();
            oi.setProductId(product.getId());
            oi.setProductName(product.getName());
            oi.setUnitLabel(product.getUnitLabel());
            oi.setUnitPrice(product.getPrice());
            oi.setGstRate(product.getGstRate());
            oi.setQuantity(ci.getQuantity());
            oi.setLineSubtotal(lineSubtotal);
            oi.setLineGst(lineGst);
            oi.setLineTotal(lineTotal);
            orderItems.add(oi);
        }

        boolean sameState = address.getState() != null
                && address.getState().trim().equalsIgnoreCase(sellerProperties.getState().trim());

        BigDecimal cgst = BigDecimal.ZERO, sgst = BigDecimal.ZERO, igst = BigDecimal.ZERO;
        if (sameState) {
            cgst = totalGst.divide(BigDecimal.valueOf(2), 2, RoundingMode.HALF_UP);
            sgst = totalGst.subtract(cgst); // avoids losing a paisa to rounding
        } else {
            igst = totalGst;
        }

        BigDecimal shippingFee = subtotal.compareTo(shippingProperties.getFreeAboveSubtotal()) >= 0
                ? BigDecimal.ZERO
                : shippingProperties.getFlatFee();

        BigDecimal total = subtotal.add(cgst).add(sgst).add(igst).add(shippingFee);

        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setUserId(userId);
        order.setStatus(OrderStatus.PENDING_PAYMENT);
        order.setSubtotal(subtotal);
        order.setCgstAmount(cgst);
        order.setSgstAmount(sgst);
        order.setIgstAmount(igst);
        order.setShippingFee(shippingFee);
        order.setTotal(total);
        order.setBuyerGstin(request.getBuyerGstin());
        order.setShipName(address.getRecipientName());
        order.setShipPhone(address.getPhone());
        order.setShipLine1(address.getLine1());
        order.setShipLine2(address.getLine2());
        order.setShipCity(address.getCity());
        order.setShipState(address.getState());
        order.setShipPincode(address.getPincode());
        order = orderRepository.save(order);

        for (OrderItem oi : orderItems) {
            oi.setOrderId(order.getId());
        }
        orderItemRepository.saveAll(orderItems);

        String razorpayOrderId = razorpayService.createOrder(order.getOrderNumber(), total);
        order.setRazorpayOrderId(razorpayOrderId);
        order = orderRepository.save(order);

        OrderResponse response = OrderResponse.from(order, orderItems);
        response.razorpayOrderId = razorpayOrderId;
        response.razorpayKeyId = razorpayService.getKeyId();
        return response;
    }

    /**
     * Marks an order PAID and decrements stock, idempotently - safe to call from both the
     * client-side verify endpoint and the webhook without double-decrementing stock.
     */
    @Transactional
    public void markOrderPaid(Order order, String paymentId, String signature) {
        if (order.getStatus() != OrderStatus.PENDING_PAYMENT) {
            return; // already handled by the other path (webhook vs client callback) - no-op
        }

        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
        for (OrderItem item : items) {
            if (item.getProductId() == null) continue;
            productRepository.findById(item.getProductId()).ifPresent(product -> {
                int remaining = Math.max(0, product.getStockQty() - item.getQuantity());
                product.setStockQty(remaining);
                productRepository.save(product);
            });
        }

        order.setStatus(OrderStatus.PAID);
        order.setRazorpayPaymentId(paymentId);
        if (signature != null) order.setRazorpaySignature(signature);
        orderRepository.save(order);

        cartItemRepository.deleteByUserId(order.getUserId());

        orderMailService.sendOrderConfirmation(order, items);
    }

    public OrderResponse getOrder(Long userId, String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .filter(o -> o.getUserId().equals(userId))
                .orElseThrow(() -> ApiException.notFound("Order not found"));
        return OrderResponse.from(order, orderItemRepository.findByOrderId(order.getId()));
    }

    public Page<OrderResponse> listOrders(Long userId, Pageable pageable) {
        return orderRepository.findByUserId(userId, pageable)
                .map(o -> OrderResponse.from(o, orderItemRepository.findByOrderId(o.getId())));
    }

    private String generateOrderNumber() {
        String prefix = "VF" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyMMdd"));
        String candidate;
        Random random = new Random();
        do {
            candidate = prefix + String.format("%04d", random.nextInt(10000));
        } while (orderRepository.existsByOrderNumber(candidate));
        return candidate;
    }
}
