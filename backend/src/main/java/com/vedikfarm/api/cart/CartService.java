package com.vedikfarm.api.cart;

import com.vedikfarm.api.cart.dto.CartResponse;
import com.vedikfarm.api.catalog.Product;
import com.vedikfarm.api.catalog.ProductRepository;
import com.vedikfarm.api.common.ApiException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartService(CartItemRepository cartItemRepository, ProductRepository productRepository) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    public CartResponse getCart(Long userId) {
        List<CartItem> items = cartItemRepository.findByUserId(userId);
        return toResponse(items);
    }

    public CartResponse addItem(Long userId, Long productId, int quantity) {
        Product product = productRepository.findById(productId)
                .filter(Product::isActive)
                .orElseThrow(() -> ApiException.notFound("Product not found"));

        CartItem item = cartItemRepository.findByUserIdAndProductId(userId, productId)
                .orElseGet(() -> {
                    CartItem ci = new CartItem();
                    ci.setUserId(userId);
                    ci.setProductId(productId);
                    ci.setQuantity(0);
                    return ci;
                });

        int newQuantity = item.getQuantity() + quantity;
        if (newQuantity > product.getStockQty()) {
            throw ApiException.badRequest("Only " + product.getStockQty() + " left in stock for " + product.getName());
        }

        item.setQuantity(newQuantity);
        cartItemRepository.save(item);

        return getCart(userId);
    }

    public CartResponse updateItem(Long userId, Long cartItemId, int quantity) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .filter(ci -> ci.getUserId().equals(userId))
                .orElseThrow(() -> ApiException.notFound("Cart item not found"));

        if (quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> ApiException.notFound("Product not found"));
            if (quantity > product.getStockQty()) {
                throw ApiException.badRequest("Only " + product.getStockQty() + " left in stock for " + product.getName());
            }
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return getCart(userId);
    }

    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }

    private CartResponse toResponse(List<CartItem> items) {
        CartResponse response = new CartResponse();
        response.items = List.of();
        response.subtotal = BigDecimal.ZERO;

        if (items.isEmpty()) {
            return response;
        }

        List<Long> productIds = items.stream().map(CartItem::getProductId).toList();
        Map<Long, Product> productsById = productRepository.findAllById(productIds).stream()
                .collect(Collectors.toMap(Product::getId, p -> p));

        BigDecimal subtotal = BigDecimal.ZERO;
        var responseItems = new java.util.ArrayList<CartResponse.Item>();

        for (CartItem ci : items) {
            Product product = productsById.get(ci.getProductId());
            if (product == null) continue; // product deleted since being added - skip silently

            CartResponse.Item item = new CartResponse.Item();
            item.cartItemId = ci.getId();
            item.productId = product.getId();
            item.name = product.getName();
            item.slug = product.getSlug();
            item.imageUrl = product.getImageUrl();
            item.unitLabel = product.getUnitLabel();
            item.unitPrice = product.getPrice();
            item.quantity = ci.getQuantity();
            item.availableStock = product.getStockQty();
            item.lineTotal = product.getPrice().multiply(BigDecimal.valueOf(ci.getQuantity()));

            subtotal = subtotal.add(item.lineTotal);
            responseItems.add(item);
        }

        response.items = responseItems;
        response.subtotal = subtotal;
        return response;
    }
}
