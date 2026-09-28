-- Dev-only seed data: default admin login so the app is usable immediately
-- after a fresh migration. Username: admin / Password: admin123
-- Replace or remove before any non-local deployment.
INSERT INTO app_user (id, username, password_hash, role, staff_id)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    'admin',
    '$2a$10$zO7NNmm5tImndMYbH65AV./qBtLLE.ZBsd8NpgsMfla0L4W4SHpYG',
    'ADMIN',
    NULL
);
