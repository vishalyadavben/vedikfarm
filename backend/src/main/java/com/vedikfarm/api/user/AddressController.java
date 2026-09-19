package com.vedikfarm.api.user;

import com.vedikfarm.api.auth.AuthenticatedUser;
import com.vedikfarm.api.common.ApiResponse;
import com.vedikfarm.api.user.dto.AddressRequest;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping
    public ApiResponse<List<Address>> list(@AuthenticationPrincipal AuthenticatedUser user) {
        return ApiResponse.ok(addressService.list(user.getUserId()));
    }

    @PostMapping
    public ApiResponse<Address> create(@AuthenticationPrincipal AuthenticatedUser user, @Valid @RequestBody AddressRequest req) {
        return ApiResponse.ok(addressService.create(user.getUserId(), req));
    }

    @PutMapping("/{id}")
    public ApiResponse<Address> update(@AuthenticationPrincipal AuthenticatedUser user, @PathVariable Long id, @Valid @RequestBody AddressRequest req) {
        return ApiResponse.ok(addressService.update(user.getUserId(), id, req));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@AuthenticationPrincipal AuthenticatedUser user, @PathVariable Long id) {
        addressService.delete(user.getUserId(), id);
        return ApiResponse.ok(null);
    }
}
