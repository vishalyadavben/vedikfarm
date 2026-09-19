package com.vedikfarm.api.cart;

import com.vedikfarm.api.auth.AuthenticatedUser;
import com.vedikfarm.api.cart.dto.AddToCartRequest;
import com.vedikfarm.api.cart.dto.CartResponse;
import com.vedikfarm.api.cart.dto.UpdateCartItemRequest;
import com.vedikfarm.api.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ApiResponse<CartResponse> getCart(@AuthenticationPrincipal AuthenticatedUser user) {
        return ApiResponse.ok(cartService.getCart(user.getUserId()));
    }

    @PostMapping("/items")
    public ApiResponse<CartResponse> addItem(@AuthenticationPrincipal AuthenticatedUser user,
                                              @Valid @RequestBody AddToCartRequest request) {
        return ApiResponse.ok(cartService.addItem(user.getUserId(), request.getProductId(), request.getQuantity()));
    }

    @PatchMapping("/items/{cartItemId}")
    public ApiResponse<CartResponse> updateItem(@AuthenticationPrincipal AuthenticatedUser user,
                                                 @PathVariable Long cartItemId,
                                                 @Valid @RequestBody UpdateCartItemRequest request) {
        return ApiResponse.ok(cartService.updateItem(user.getUserId(), cartItemId, request.getQuantity()));
    }

    @DeleteMapping
    public ApiResponse<Void> clearCart(@AuthenticationPrincipal AuthenticatedUser user) {
        cartService.clearCart(user.getUserId());
        return ApiResponse.ok(null);
    }
}
