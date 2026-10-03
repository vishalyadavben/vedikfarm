package com.vedikfarm.api.catalog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface ProductHealthConcernRepository extends JpaRepository<ProductHealthConcern, Long> {
    List<ProductHealthConcern> findByProductId(Long productId);
    List<ProductHealthConcern> findByProductIdIn(List<Long> productIds);

    @Transactional
    void deleteByProductId(Long productId);
}
