package com.vedikfarm.api.admin;

import com.vedikfarm.api.admin.dto.ProductAdminRequest;
import com.vedikfarm.api.admin.dto.UpdateStockRequest;
import com.vedikfarm.api.catalog.ImageStorageService;
import com.vedikfarm.api.catalog.Product;
import com.vedikfarm.api.catalog.ProductRepository;
import com.vedikfarm.api.catalog.dto.ProductResponse;
import com.vedikfarm.api.common.ApiException;
import com.vedikfarm.api.common.ApiResponse;
import com.vedikfarm.api.common.SlugUtil;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

/** Everything here is behind ROLE_ADMIN - see SecurityConfig ("/api/admin/**" -> hasRole("ADMIN")). */
@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    private final ProductRepository productRepository;
    private final ImageStorageService imageStorageService;

    public AdminProductController(ProductRepository productRepository, ImageStorageService imageStorageService) {
        this.productRepository = productRepository;
        this.imageStorageService = imageStorageService;
    }

    @GetMapping
    public ApiResponse<Page<ProductResponse>> list(@RequestParam(defaultValue = "0") int page,
                                                     @RequestParam(defaultValue = "50") int size) {
        var pageable = PageRequest.of(page, Math.min(size, 200), Sort.by("id").descending());
        return ApiResponse.ok(productRepository.findAll(pageable).map(ProductResponse::from));
    }

    @PostMapping
    public ApiResponse<ProductResponse> create(@Valid @RequestBody ProductAdminRequest req) {
        Product product = new Product();
        applyFields(product, req);
        product.setSlug(uniqueSlug(req.getName()));
        return ApiResponse.ok(ProductResponse.from(productRepository.save(product)));
    }

    @PutMapping("/{id}")
    public ApiResponse<ProductResponse> update(@PathVariable Long id, @Valid @RequestBody ProductAdminRequest req) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Product not found"));
        applyFields(product, req);
        product.setUpdatedAt(LocalDateTime.now());
        return ApiResponse.ok(ProductResponse.from(productRepository.save(product)));
    }

    @PatchMapping("/{id}/stock")
    public ApiResponse<ProductResponse> updateStock(@PathVariable Long id, @Valid @RequestBody UpdateStockRequest req) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Product not found"));
        product.setStockQty(req.getStockQty());
        product.setUpdatedAt(LocalDateTime.now());
        return ApiResponse.ok(ProductResponse.from(productRepository.save(product)));
    }

    @PostMapping("/{id}/image")
    public ApiResponse<ProductResponse> uploadImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Product not found"));
        String url = imageStorageService.upload(file);
        product.setImageUrl(url);
        product.setUpdatedAt(LocalDateTime.now());
        return ApiResponse.ok(ProductResponse.from(productRepository.save(product)));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        // Soft delete only - order_items references products with ON DELETE SET NULL, but
        // deactivating instead of hard-deleting keeps past orders' product links intact
        // and avoids surprises if the product should come back in stock later.
        Product product = productRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Product not found"));
        product.setActive(false);
        product.setUpdatedAt(LocalDateTime.now());
        productRepository.save(product);
        return ApiResponse.ok(null);
    }

    private void applyFields(Product product, ProductAdminRequest req) {
        product.setName(req.getName());
        product.setDescription(req.getDescription());
        product.setPrice(req.getPrice());
        product.setUnitLabel(req.getUnitLabel());
        product.setStockQty(req.getStockQty());
        product.setCategoryId(req.getCategoryId());
        product.setGstRate(req.getGstRate());
        product.setActive(req.isActive());
    }

    private String uniqueSlug(String name) {
        String base = SlugUtil.slugify(name);
        String slug = base;
        int suffix = 2;
        while (productRepository.existsBySlug(slug)) {
            slug = base + "-" + suffix++;
        }
        return slug;
    }
}
