package com.vedikfarm.api.admin;

import com.vedikfarm.api.admin.dto.HealthConcernAdminRequest;
import com.vedikfarm.api.catalog.HealthConcern;
import com.vedikfarm.api.catalog.HealthConcernRepository;
import com.vedikfarm.api.catalog.ImageStorageService;
import com.vedikfarm.api.catalog.ProductHealthConcernRepository;
import com.vedikfarm.api.catalog.dto.HealthConcernResponse;
import com.vedikfarm.api.common.ApiException;
import com.vedikfarm.api.common.ApiResponse;
import com.vedikfarm.api.common.SlugUtil;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Lets admins manage the "shop by health concern" tags shown on the Home page, and which
 * products are filed under each one (see AdminProductController's /health-concerns sub-resource
 * for the product side of that assignment). Everything here is behind ROLE_ADMIN - see
 * SecurityConfig ("/api/admin/**" -> hasRole("ADMIN")).
 */
@RestController
@RequestMapping("/api/admin/health-concerns")
public class AdminHealthConcernController {

    private final HealthConcernRepository healthConcernRepository;
    private final ProductHealthConcernRepository productHealthConcernRepository;
    private final ImageStorageService imageStorageService;

    public AdminHealthConcernController(HealthConcernRepository healthConcernRepository,
                                         ProductHealthConcernRepository productHealthConcernRepository,
                                         ImageStorageService imageStorageService) {
        this.healthConcernRepository = healthConcernRepository;
        this.productHealthConcernRepository = productHealthConcernRepository;
        this.imageStorageService = imageStorageService;
    }

    @GetMapping
    public ApiResponse<List<HealthConcernResponse>> list() {
        return ApiResponse.ok(healthConcernRepository.findAllByOrderBySortOrderAscNameAsc()
                .stream().map(HealthConcernResponse::from).toList());
    }

    @PostMapping
    public ApiResponse<HealthConcernResponse> create(@Valid @RequestBody HealthConcernAdminRequest req) {
        HealthConcern concern = new HealthConcern();
        applyFields(concern, req);
        concern.setSlug(uniqueSlug(req.getName()));
        return ApiResponse.ok(HealthConcernResponse.from(healthConcernRepository.save(concern)));
    }

    @PutMapping("/{id}")
    public ApiResponse<HealthConcernResponse> update(@PathVariable Long id, @Valid @RequestBody HealthConcernAdminRequest req) {
        HealthConcern concern = healthConcernRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Health concern not found"));
        applyFields(concern, req);
        concern.setUpdatedAt(LocalDateTime.now());
        return ApiResponse.ok(HealthConcernResponse.from(healthConcernRepository.save(concern)));
    }

    @PostMapping("/{id}/image")
    public ApiResponse<HealthConcernResponse> uploadImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        HealthConcern concern = healthConcernRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Health concern not found"));
        String url = imageStorageService.upload(file, "health-concerns");
        concern.setImageUrl(url);
        concern.setUpdatedAt(LocalDateTime.now());
        return ApiResponse.ok(HealthConcernResponse.from(healthConcernRepository.save(concern)));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        HealthConcern concern = healthConcernRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Health concern not found"));
        // Hard delete is fine here (unlike products, nothing references a concern for historical
        // record-keeping) - the FK is ON DELETE CASCADE so product tags against it go too.
        healthConcernRepository.delete(concern);
        return ApiResponse.ok(null);
    }

    private void applyFields(HealthConcern concern, HealthConcernAdminRequest req) {
        concern.setName(req.getName());
        concern.setSortOrder(req.getSortOrder());
        concern.setActive(req.isActive());
    }

    private String uniqueSlug(String name) {
        String base = SlugUtil.slugify(name);
        String slug = base;
        int suffix = 2;
        while (healthConcernRepository.existsBySlug(slug)) {
            slug = base + "-" + suffix++;
        }
        return slug;
    }
}
