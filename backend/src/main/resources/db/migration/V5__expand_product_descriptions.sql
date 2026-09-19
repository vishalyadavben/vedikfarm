-- Replaces the one-line placeholder descriptions from V2 with fuller, product-specific
-- copy for the product detail page. Kept factual (sourcing, how it's made/used, storage) -
-- no invented nutrition/medical claims or fabricated numbers.
--
-- Note: plain single-quoted string literals are used (not `||` concatenation) because
-- MySQL treats `||` as logical OR by default, not string concatenation.

UPDATE products SET description =
'Made from A2 Gir cow milk using the traditional bilona method - curd is hand-churned before the butter is slow-cooked into ghee, rather than separating cream directly from milk. This slower process is how ghee has traditionally been made in Indian households for generations. Store in a cool, dry place; refrigeration isn''t required.'
WHERE slug = 'a2-gir-cow-ghee';

UPDATE products SET description =
'Fresh A2 Gir cow milk from indigenous Gir cows, delivered close to milking time. Gir cows are one of India''s oldest indigenous breeds, valued for producing A2-type protein rather than the A1 protein found in many crossbred and industrially farmed cattle. Best boiled before drinking, refrigerated promptly, and used within a day or two of delivery.'
WHERE slug = 'a2-gir-cow-milk';

UPDATE products SET description =
'Whole black peppercorns grown without synthetic pesticides or fertilisers. Sun-dried and left whole rather than pre-ground, so the essential oils - and the heat - stay intact until you grind them fresh at home. Works in everyday cooking, spice blends, and herbal decoctions (kadha).'
WHERE slug = 'organic-black-pepper';

UPDATE products SET description =
'Organically grown chia seeds that swell and turn gel-like when soaked - popular in overnight oats, smoothies, and as an egg substitute in baking. Sold raw and unprocessed; store in an airtight container away from moisture.'
WHERE slug = 'organic-chia-seeds';

UPDATE products SET description =
'Made by drying and finely grinding organic coconut, with nothing added. Works as a substitute for desiccated coconut in cooking and baking, or reconstituted with warm water for a quick coconut milk base.'
WHERE slug = 'organic-coconut-powder';

UPDATE products SET description =
'Organically grown flax seeds (alsi). Best consumed lightly roasted and ground just before eating, since whole flax seeds largely pass through undigested. Also used in atta blends, chutneys, and podi mixes.'
WHERE slug = 'organic-flax-seeds';

UPDATE products SET description =
'Unrefined pink rock salt sourced from ancient mineral deposits, ground fine for everyday cooking. Unlike heavily processed table salt, it isn''t chemically bleached or treated with anti-caking agents.'
WHERE slug = 'organic-himalayan-pink-salt';
