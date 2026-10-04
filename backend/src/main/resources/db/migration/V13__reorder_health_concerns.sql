-- Fresh display order for the Home page "Select Health Concern" row (admins can still change it
-- under Admin > Health Concerns > Sort Order).
UPDATE health_concerns SET sort_order = 1 WHERE slug = 'energy';
UPDATE health_concerns SET sort_order = 2 WHERE slug = 'skin-hair';
UPDATE health_concerns SET sort_order = 3 WHERE slug = 'heart-health';
UPDATE health_concerns SET sort_order = 4 WHERE slug = 'sugar-management';
UPDATE health_concerns SET sort_order = 5 WHERE slug = 'kids-nutrition';
UPDATE health_concerns SET sort_order = 6 WHERE slug = 'womens-health';
UPDATE health_concerns SET sort_order = 7 WHERE slug = 'gym-fitness';
UPDATE health_concerns SET sort_order = 8 WHERE slug = 'liver-health';
UPDATE health_concerns SET sort_order = 9 WHERE slug = 'daily-ayurveda-grocery';
