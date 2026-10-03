-- "Healthy Combos" is a normal category, same as Milk Products / Organic Products - it just
-- groups together whichever products the admin tags under it (e.g. multi-item combo packs),
-- so it reuses the existing product CRUD (title, image, price) with no special combo logic.
INSERT INTO categories (name, slug) VALUES ('Healthy Combos', 'healthy-combos');
