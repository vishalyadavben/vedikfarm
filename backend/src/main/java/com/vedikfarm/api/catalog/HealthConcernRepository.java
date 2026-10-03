package com.vedikfarm.api.catalog;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface HealthConcernRepository extends JpaRepository<HealthConcern, Long> {
    Optional<HealthConcern> findBySlug(String slug);
    boolean existsBySlug(String slug);
    List<HealthConcern> findByActiveTrueOrderBySortOrderAscNameAsc();
    List<HealthConcern> findAllByOrderBySortOrderAscNameAsc();
}
