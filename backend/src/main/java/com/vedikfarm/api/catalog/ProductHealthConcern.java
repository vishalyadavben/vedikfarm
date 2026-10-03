package com.vedikfarm.api.catalog;

import jakarta.persistence.*;

/**
 * Join row tagging a product with one health concern. Plain FK-id columns (not a JPA
 * @ManyToMany) to match how the rest of this codebase models relationships - see Product's
 * categoryId for the same pattern.
 */
@Entity
@Table(name = "product_health_concerns")
public class ProductHealthConcern {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "health_concern_id", nullable = false)
    private Long healthConcernId;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Long getHealthConcernId() { return healthConcernId; }
    public void setHealthConcernId(Long healthConcernId) { this.healthConcernId = healthConcernId; }
}
