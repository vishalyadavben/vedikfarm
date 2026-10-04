-- One-row settings table for the countdown "sale strip" at the top of the site.
-- Times are IST wall-clock (the JDBC connection uses serverTimezone=Asia/Kolkata).
CREATE TABLE sale_banner (
    id         BIGINT PRIMARY KEY,
    label      VARCHAR(150) NOT NULL,
    link_url   VARCHAR(300),
    start_at   DATETIME NULL,
    end_at     DATETIME NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO sale_banner (id, label, is_enabled) VALUES (1, 'Festive Sale Ends in', FALSE);
