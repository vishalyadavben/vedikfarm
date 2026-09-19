package com.vedikfarm.api.catalog;

import com.vedikfarm.api.auth.AuthenticatedUser;
import com.vedikfarm.api.catalog.dto.CategoryResponse;
import com.vedikfarm.api.catalog.dto.ProductResponse;
import com.vedikfarm.api.catalog.dto.ReviewRequest;
import com.vedikfarm.api.catalog.dto.ReviewResponse;
import com.vedikfarm.api.common.ApiException;
import com.vedikfarm.api.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Public, read-only catalog endpoints - anyone can browse without logging in. */
@RestController
public class ProductController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;
    private final ReviewService reviewService;

    public ProductController(ProductRepository productRepository, CategoryRepository categoryRepository,
                              ProductImageRepository productImageRepository, ReviewService reviewService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productImageRepository = productImageRepository;
        this.reviewService = reviewService;
    }

    @GetMapping("/api/categories")
    public ApiResponse<Iterable<CategoryResponse>> listCategories() {
        return ApiResponse.ok(categoryRepository.findAll().stream().map(CategoryResponse::from).toList());
    }

    @GetMapping("/api/products")
    public ApiResponse<Page<ProductResponse>> listProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, Math.min(size, 100), Sort.by("name").ascending());
        String query = (search != null && !search.isBlank()) ? search.trim() : null;

        Page<Product> products;
        if (category != null && !category.isBlank()) {
            Category cat = categoryRepository.findBySlug(category)
                    .orElseThrow(() -> ApiException.notFound("Category not found"));
            products = (query != null)
                    ? productRepository.findByActiveTrueAndCategoryIdAndNameContainingIgnoreCase(cat.getId(), query, pageable)
                    : productRepository.findByActiveTrueAndCategoryId(cat.getId(), pageable);
        } else {
            products = (query != null)
                    ? productRepository.findByActiveTrueAndNameContainingIgnoreCase(query, pageable)
                    : productRepository.findByActiveTrue(pageable);
        }

        return ApiResponse.ok(products.map(ProductResponse::from));
    }

    @GetMapping("/api/products/{slug}")
    public ApiResponse<ProductResponse> getProduct(@PathVariable String slug) {
        Product product = productRepository.findBySlug(slug)
                .filter(Product::isActive)
                .orElseThrow(() -> ApiException.notFound("Product not found"));
        ProductResponse response = ProductResponse.from(product);
        response.images = productImageRepository.findByProductIdOrderBySortOrderAscIdAsc(product.getId())
                .stream().map(ProductImage::getImageUrl).toList();
        return ApiResponse.ok(response);
    }

    @GetMapping("/api/products/{slug}/reviews")
    public ApiResponse<List<ReviewResponse>> listReviews(@PathVariable String slug) {
        return ApiResponse.ok(reviewService.listReviews(slug));
    }

    @PostMapping("/api/products/{slug}/reviews")
    public ApiResponse<ReviewResponse> addReview(@PathVariable String slug,
                                                  @AuthenticationPrincipal AuthenticatedUser user,
                                                  @Valid @RequestBody ReviewRequest request) {
        return ApiResponse.ok(reviewService.addReview(slug, user.getUserId(), request));
    }
}
