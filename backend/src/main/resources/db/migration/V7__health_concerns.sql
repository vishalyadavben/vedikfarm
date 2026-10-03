CREATE TABLE health_concerns (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    slug            VARCHAR(120) NOT NULL UNIQUE,
    image_url       VARCHAR(500),
    sort_order      INT NOT NULL DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE product_health_concerns (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id          BIGINT NOT NULL,
    health_concern_id   BIGINT NOT NULL,
    CONSTRAINT uq_product_concern UNIQUE (product_id, health_concern_id),
    CONSTRAINT fk_phc_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_phc_concern FOREIGN KEY (health_concern_id) REFERENCES health_concerns(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_phc_product ON product_health_concerns(product_id);
CREATE INDEX idx_phc_concern ON product_health_concerns(health_concern_id);

-- Starter set matching the "shop by concern" categories the admin wants on the Home page.
-- No image_url yet - the admin uploads an icon for each from /admin/health-concerns, and a
-- plain placeholder icon shows on the storefront until then.
INSERT INTO health_concerns (name, slug, sort_order) VALUES
    ('Sugar Management', 'sugar-management', 1),
    ('Gym & Fitness', 'gym-fitness', 2),
    ('Energy', 'energy', 3),
    ('Heart Health', 'heart-health', 4),
    ('Liver Health', 'liver-health', 5),
    ('Kids Nutrition', 'kids-nutrition', 6),
    ('Daily Ayurveda & Grocery', 'daily-ayurveda-grocery', 7),
    ('Skin & Hair', 'skin-hair', 8),
    ('Women''s Health', 'womens-health', 9);
