-- Customer photo (optional) and star rating (1-5) shown on each testimonial card.
ALTER TABLE testimonials
    ADD COLUMN image_url VARCHAR(500) NULL,
    ADD COLUMN rating INT NOT NULL DEFAULT 5;
