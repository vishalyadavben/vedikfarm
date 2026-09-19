package com.vedikfarm.api.catalog;

import com.vedikfarm.api.catalog.dto.ReviewRequest;
import com.vedikfarm.api.catalog.dto.ReviewResponse;
import com.vedikfarm.api.common.ApiException;
import com.vedikfarm.api.user.User;
import com.vedikfarm.api.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class ReviewService {

    private final ProductRepository productRepository;
    private final ProductReviewRepository reviewRepository;
    private final UserRepository userRepository;

    public ReviewService(ProductRepository productRepository, ProductReviewRepository reviewRepository,
                          UserRepository userRepository) {
        this.productRepository = productRepository;
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
    }

    public List<ReviewResponse> listReviews(String slug) {
        Product product = findActiveProduct(slug);
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(product.getId())
                .stream().map(ReviewResponse::from).toList();
    }

    @Transactional
    public ReviewResponse addReview(String slug, Long userId, ReviewRequest request) {
        Product product = findActiveProduct(slug);

        if (reviewRepository.existsByProductIdAndUserId(product.getId(), userId)) {
            throw ApiException.conflict("You've already reviewed this product.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("User not found"));

        ProductReview review = new ProductReview();
        review.setProductId(product.getId());
        review.setUserId(userId);
        review.setReviewerName(user.getName());
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        reviewRepository.save(review);

        recomputeRating(product);

        return ReviewResponse.from(review);
    }

    private void recomputeRating(Product product) {
        List<ProductReview> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(product.getId());
        int count = reviews.size();
        double average = reviews.stream().mapToInt(ProductReview::getRating).average().orElse(0.0);
        product.setRatingCount(count);
        product.setRatingAvg(BigDecimal.valueOf(average).setScale(2, RoundingMode.HALF_UP));
        productRepository.save(product);
    }

    private Product findActiveProduct(String slug) {
        return productRepository.findBySlug(slug)
                .filter(Product::isActive)
                .orElseThrow(() -> ApiException.notFound("Product not found"));
    }
}
