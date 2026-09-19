-- V4 created product_reviews.rating as TINYINT, but the JPA entity (a plain Java int)
-- maps to SQL INTEGER, so Hibernate's schema validation ("wrong column type encountered
-- in column [rating] ... found [tinyint], but expecting [integer]") fails on startup.
-- Fixing forward rather than editing V4, which Flyway has already applied.

ALTER TABLE product_reviews MODIFY COLUMN rating INT NOT NULL;
