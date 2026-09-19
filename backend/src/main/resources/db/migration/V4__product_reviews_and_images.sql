-- Adds real customer ratings/reviews and support for multiple gallery images per product.
-- rating_avg/rating_count are denormalized onto products for fast display on listing pages -
-- both start at zero and are only ever updated from actual submitted reviews, never seeded
-- with fake numbers.

ALTER TABLE products
    ADD COLUMN rating_avg   DECIMAL(3,2) NOT NULL DEFAULT 0.00,
    ADD COLUMN rating_count INT NOT NULL DEFAULT 0;

CREATE TABLE product_reviews (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id      BIGINT NOT NULL,
    user_id         BIGINT NOT NULL,
    -- Snapshot of the reviewer's name at review time (matches the order_items pattern -
    -- a review shouldn't change retroactively if the user later renames their account).
    reviewer_name   VARCHAR(150) NOT NULL,
    rating          TINYINT NOT NULL,
    comment         TEXT,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_reviews_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_product_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_product_reviews_product_user UNIQUE (product_id, user_id),
    CONSTRAINT chk_product_reviews_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_product_reviews_product ON product_reviews(product_id);

CREATE TABLE product_images (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id      BIGINT NOT NULL,
    image_url       VARCHAR(500) NOT NULL,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_product_images_product ON product_images(product_id);
