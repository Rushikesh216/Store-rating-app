
USE store_rating_db;


ALTER TABLE users 
ADD COLUMN owner_id VARCHAR(20) NULL AFTER role;


ALTER TABLE users 
ADD CONSTRAINT uq_users_owner_id UNIQUE (owner_id);


ALTER TABLE users 
ADD INDEX idx_users_owner_id (owner_id);


UPDATE users 
SET owner_id = 'OWNER001' 
WHERE id = 2 AND role = 'OWNER';

UPDATE users 
SET owner_id = 'OWNER002' 
WHERE id = 4 AND role = 'OWNER';


SELECT id, name, email, role, owner_id FROM users WHERE role = 'OWNER';
