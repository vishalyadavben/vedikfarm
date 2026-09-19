package com.vedikfarm.api.catalog.dto;

import com.vedikfarm.api.catalog.ProductReview;
import java.time.LocalDateTime;

public class ReviewResponse {
    public Long id;
    public String reviewerName;
    public int rating;
    public String comment;
    public LocalDateTime createdAt;

    public static ReviewResponse from(ProductReview r) {
        ReviewResponse res = new ReviewResponse();
        res.id = r.getId();
        res.reviewerName = r.getReviewerName();
        res.rating = r.getRating();
        res.comment = r.getComment();
        res.createdAt = r.getCreatedAt();
        return res;
    }
}
