-- Customer quotes (from WhatsApp, calls, Google reviews, ...) typed in by the admin and shown on Home + About.
CREATE TABLE testimonials (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    quote         TEXT NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    city          VARCHAR(100),
    sort_order    INT NOT NULL DEFAULT 0,
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
