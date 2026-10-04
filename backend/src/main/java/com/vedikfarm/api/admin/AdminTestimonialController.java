package com.vedikfarm.api.admin;

import com.vedikfarm.api.catalog.ImageStorageService;
import com.vedikfarm.api.common.ApiException;
import com.vedikfarm.api.common.ApiResponse;
import com.vedikfarm.api.testimonial.Testimonial;
import com.vedikfarm.api.testimonial.TestimonialRepository;
import com.vedikfarm.api.testimonial.dto.TestimonialAdminRequest;
import com.vedikfarm.api.testimonial.dto.TestimonialResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

/** Everything here is behind ROLE_ADMIN - see SecurityConfig ("/api/admin/**" -> hasRole("ADMIN")). */
@RestController
@RequestMapping("/api/admin/testimonials")
public class AdminTestimonialController {

    private final TestimonialRepository repository;
    private final ImageStorageService imageStorageService;

    public AdminTestimonialController(TestimonialRepository repository, ImageStorageService imageStorageService) {
        this.repository = repository;
        this.imageStorageService = imageStorageService;
    }

    /** Everything, including hidden ones, in display order. */
    @GetMapping
    public ApiResponse<List<TestimonialResponse>> list() {
        return ApiResponse.ok(repository.findAllByOrderBySortOrderAscIdAsc()
                .stream().map(TestimonialResponse::from).toList());
    }

    @PostMapping
    public ApiResponse<TestimonialResponse> create(@Valid @RequestBody TestimonialAdminRequest req) {
        Testimonial t = new Testimonial();
        applyFields(t, req);
        return ApiResponse.ok(TestimonialResponse.from(repository.save(t)));
    }

    @PutMapping("/{id}")
    public ApiResponse<TestimonialResponse> update(@PathVariable Long id, @Valid @RequestBody TestimonialAdminRequest req) {
        Testimonial t = repository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Testimonial not found"));
        applyFields(t, req);
        t.setUpdatedAt(LocalDateTime.now());
        return ApiResponse.ok(TestimonialResponse.from(repository.save(t)));
    }

    /** Customer photo shown as the round avatar on the card. */
    @PostMapping("/{id}/image")
    public ApiResponse<TestimonialResponse> uploadImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        Testimonial t = repository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Testimonial not found"));
        t.setImageUrl(imageStorageService.upload(file, "testimonials"));
        t.setUpdatedAt(LocalDateTime.now());
        return ApiResponse.ok(TestimonialResponse.from(repository.save(t)));
    }

    /** Swaps display positions with the neighbouring testimonial (direction = "up" or "down"). */
    @PostMapping("/{id}/move")
    public ApiResponse<List<TestimonialResponse>> move(@PathVariable Long id, @RequestParam String direction) {
        List<Testimonial> all = repository.findAllByOrderBySortOrderAscIdAsc();
        // Re-number 0..n-1 first so ties / gaps in sortOrder can't make a swap a no-op.
        for (int i = 0; i < all.size(); i++) all.get(i).setSortOrder(i);
        int index = -1;
        for (int i = 0; i < all.size(); i++) if (all.get(i).getId().equals(id)) index = i;
        if (index < 0) throw ApiException.notFound("Testimonial not found");
        int target = "up".equals(direction) ? index - 1 : "down".equals(direction) ? index + 1 : index;
        if (target >= 0 && target < all.size() && target != index) {
            int tmp = all.get(index).getSortOrder();
            all.get(index).setSortOrder(all.get(target).getSortOrder());
            all.get(target).setSortOrder(tmp);
        }
        repository.saveAll(all);
        return ApiResponse.ok(repository.findAllByOrderBySortOrderAscIdAsc()
                .stream().map(TestimonialResponse::from).toList());
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        Testimonial t = repository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Testimonial not found"));
        repository.delete(t);
        return ApiResponse.ok(null);
    }

    private void applyFields(Testimonial t, TestimonialAdminRequest req) {
        t.setQuote(req.getQuote().trim());
        t.setCustomerName(req.getCustomerName().trim());
        String city = req.getCity() == null ? "" : req.getCity().trim();
        t.setCity(city.isEmpty() ? null : city);
        t.setRating(req.getRating());
        t.setSortOrder(req.getSortOrder());
        t.setActive(req.isActive());
    }
}
