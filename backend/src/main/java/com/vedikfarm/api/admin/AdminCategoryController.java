package com.vedikfarm.api.admin;

import com.vedikfarm.api.catalog.Category;
import com.vedikfarm.api.catalog.CategoryRepository;
import com.vedikfarm.api.catalog.dto.CategoryResponse;
import com.vedikfarm.api.common.ApiResponse;
import com.vedikfarm.api.common.SlugUtil;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Everything here is behind ROLE_ADMIN - see SecurityConfig ("/api/admin/**" -> hasRole("ADMIN")). */
@RestController
@RequestMapping("/api/admin/categories")
public class AdminCategoryController {

    private final CategoryRepository categoryRepository;

    public AdminCategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public static class CreateCategoryRequest {
        @NotBlank public String name;
    }

    @PostMapping
    public ApiResponse<CategoryResponse> create(@RequestBody CreateCategoryRequest req) {
        Category category = new Category();
        category.setName(req.name);
        category.setSlug(SlugUtil.slugify(req.name));
        return ApiResponse.ok(CategoryResponse.from(categoryRepository.save(category)));
    }

    @GetMapping
    public ApiResponse<List<CategoryResponse>> list() {
        return ApiResponse.ok(categoryRepository.findAll().stream().map(CategoryResponse::from).toList());
    }
}
