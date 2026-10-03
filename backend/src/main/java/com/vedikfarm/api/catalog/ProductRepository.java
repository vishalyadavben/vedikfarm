package com.vedikfarm.api.catalog;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySlug(String slug);
    boolean existsBySlug(String slug);

    /**
     * Single flexible query backing the public /api/products listing: category, search and
     * health-concern filters are all optional and can be combined freely. categoryId/concernId
     * are resolved from their slugs by the controller before calling this; search is already
     * lower-cased-at-query-time via LOWER(...) so callers can pass it as typed.
     */
    @Query("""
            SELECT p FROM Product p
            WHERE p.active = true
              AND (:categoryId IS NULL OR p.categoryId = :categoryId)
              AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')))
              AND (:concernId IS NULL OR p.id IN (
                  SELECT phc.productId FROM ProductHealthConcern phc WHERE phc.healthConcernId = :concernId))
            """)
    Page<Product> searchActive(@Param("categoryId") Long categoryId,
                                @Param("search") String search,
                                @Param("concernId") Long concernId,
                                Pageable pageable);
}
