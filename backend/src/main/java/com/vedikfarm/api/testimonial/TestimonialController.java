package com.vedikfarm.api.testimonial;

import com.vedikfarm.api.common.ApiResponse;
import com.vedikfarm.api.testimonial.dto.TestimonialResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Public read-only list of visible testimonials, in the admin-configured order (Home + About pages). */
@RestController
public class TestimonialController {

    private final TestimonialRepository repository;

    public TestimonialController(TestimonialRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/api/testimonials")
    public ApiResponse<List<TestimonialResponse>> list() {
        return ApiResponse.ok(repository.findByActiveTrueOrderBySortOrderAscIdAsc()
                .stream().map(TestimonialResponse::from).toList());
    }
}
