-- Seed data pulled from the live vedikfarm.in site on 2026-09-06.
-- NOTE: only 9 of the ~14 products on the current site had a visible price/details
-- at the time this was scraped (pagination hid the rest). The 5 missing products
-- (site also references: rosemary, rolled oats, and others under "Organic Products")
-- need to be added by hand once their real prices/descriptions/images are confirmed -
-- see the admin panel "Add product" screen, or insert directly following this pattern.

INSERT INTO categories (name, slug) VALUES
    ('Milk Products', 'milk-products'),
    ('Organic Products', 'organic-products');

-- Milk Products
INSERT INTO products (category_id, name, slug, description, price, unit_label, stock_qty, gst_rate, is_active) VALUES
    ((SELECT id FROM categories WHERE slug = 'milk-products'), 'A2 Gir Cow Ghee', 'a2-gir-cow-ghee', 'Pure A2 Gir cow ghee, made the traditional way.', 1080.00, '500ml', 50, 0.00, TRUE),
    ((SELECT id FROM categories WHERE slug = 'milk-products'), 'A2 Gir Cow Milk', 'a2-gir-cow-milk', 'Fresh A2 Gir cow milk, direct from the farm.', 39.50, '500ml', 100, 0.00, TRUE);

-- Organic Products
INSERT INTO products (category_id, name, slug, description, price, unit_label, stock_qty, gst_rate, is_active) VALUES
    ((SELECT id FROM categories WHERE slug = 'organic-products'), 'Organic Black Pepper', 'organic-black-pepper', 'Organic whole black pepper.', 210.00, '250g', 40, 0.00, TRUE),
    ((SELECT id FROM categories WHERE slug = 'organic-products'), 'Organic Chia Seeds', 'organic-chia-seeds', 'Organic chia seeds.', 60.00, '250g', 60, 0.00, TRUE),
    ((SELECT id FROM categories WHERE slug = 'organic-products'), 'Organic Coconut Powder', 'organic-coconut-powder', 'Organic coconut powder.', 100.00, '250g', 40, 0.00, TRUE),
    ((SELECT id FROM categories WHERE slug = 'organic-products'), 'Organic Flax Seeds', 'organic-flax-seeds', 'Organic flax seeds.', 40.00, '250g', 50, 0.00, TRUE),
    ((SELECT id FROM categories WHERE slug = 'organic-products'), 'Organic Himalayan Pink Salt', 'organic-himalayan-pink-salt', 'Organic Himalayan pink salt.', 16.00, '100g', 80, 0.00, TRUE),
    -- Prices were not shown on the live site for these two - placeholder 0.00,
    -- must be corrected in the admin panel before launch.
    ((SELECT id FROM categories WHERE slug = 'organic-products'), 'Organic Ajwain', 'organic-ajwain', 'Organic ajwain (carom seeds). PRICE NOT SET - update before launch.', 0.00, '100g', 0, 0.00, FALSE),
    ((SELECT id FROM categories WHERE slug = 'organic-products'), 'Organic Jaggery Powder', 'organic-jaggery-powder', 'Organic jaggery powder. PRICE NOT SET - update before launch.', 0.00, '500g', 0, 0.00, FALSE);
