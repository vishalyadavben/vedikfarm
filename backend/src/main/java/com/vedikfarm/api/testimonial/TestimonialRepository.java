package com.vedikfarm.api.testimonial;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestimonialRepository extends JpaRepository<Testimonial, Long> {
    List<Testimonial> findByActiveTrueOrderBySortOrderAscIdAsc();
    List<Testimonial> findAllByOrderBySortOrderAscIdAsc();
}
