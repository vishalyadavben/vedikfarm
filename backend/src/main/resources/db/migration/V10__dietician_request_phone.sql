-- Contact number the dietician team should call for the free consultation (separate from the account phone,
-- which is optional at signup). Nullable only because rows submitted before this column existed have none.
ALTER TABLE dietician_requests ADD COLUMN phone VARCHAR(20) NULL AFTER height_cm;
