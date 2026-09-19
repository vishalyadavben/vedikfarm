package com.vedikfarm.api.catalog;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findByProductIdOrderBySortOrderAscIdAsc(Long productId);
    Optional<ProductImage> findByIdAndProductId(Long id, Long productId);
    int countByProductId(Long productId);
}
