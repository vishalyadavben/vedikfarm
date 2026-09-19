package com.vedikfarm.api.catalog;

import com.vedikfarm.api.catalog.dto.CategoryResponse;
import com.vedikfarm.api.catalog.dto.ProductResponse;
import com.vedikfarm.api.common.ApiException;
import com.vedikfarm.api.common.ApiResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

/** Public, read-only catalog endpoints - anyone can browse without logging in. */
@RestController
public class ProductController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductController(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/api/categories")
    public ApiResponse<Iterable<CategoryResponse>> listCategories() {
        return ApiResponse.ok(categoryRepository.findAll().stream().map(CategoryResponse::from).toList());
    }

    @GetMapping("/api/products")
    public ApiResponse<Page<ProductResponse>> listProducts(
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, Math.min(size, 100), Sort.by("name").ascending());

        Page<Product> products;
        if (category != null && !category.isBlank()) {
            Category cat = categoryRepository.findBySlug(category)
                    .orElseThrow(() -> ApiException.notFound("Category not found"));
            products = productRepository.findByActiveTrueAndCategoryId(cat.getId(), pageable);
        } else {
            products = productRepository.findByActiveTrue(pageable);
        }

        return ApiResponse.ok(products.map(ProductResponse::from));
    }

    @GetMapping("/api/products/{slug}")
    public ApiResponse<ProductResponse> getProduct(@PathVariable String slug) {
        Product product = productRepository.findBySlug(slug)
                .filter(Product::isActive)
                .orElseThrow(() -> ApiException.notFound("Product not found"));
        return ApiResponse.ok(ProductResponse.from(product));
    }
}
