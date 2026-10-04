-- "My Dietician Plan": one row per customer with the details they submitted to claim the free
-- consultation. Resubmitting updates the same row (UNIQUE user_id) rather than piling up duplicates.
CREATE TABLE dietician_requests (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id       BIGINT NOT NULL UNIQUE,
    name          VARCHAR(150) NOT NULL,
    date_of_birth DATE NOT NULL,
    age           INT NOT NULL,
    height_cm     DECIMAL(5,1) NOT NULL,
    disease       TEXT,
    status        VARCHAR(20) NOT NULL DEFAULT 'NEW',
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_dietician_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
