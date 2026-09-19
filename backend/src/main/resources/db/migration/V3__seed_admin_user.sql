-- Bootstrap admin account so there's a way into the admin panel on first deploy.
-- Login: admin@vedikfarm.in / ChangeMe123!
-- IMPORTANT: log in and change this password immediately after first deploy -
-- this hash is committed to the repo and must not be treated as a secret.
INSERT INTO users (email, password_hash, name, phone, role) VALUES
    ('admin@vedikfarm.in', '$2b$10$t8hxmZFoUSXvGiqX4llNrudmgPlOTkKDztQ/iHos766lZhJGSsLWK', 'Vedik Farm Admin', NULL, 'ADMIN');
