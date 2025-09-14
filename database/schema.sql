CREATE DATABASE IF NOT EXISTS store_rating_db;
USE store_rating_db;


CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(400),
  role ENUM('ADMIN','USER','OWNER') NOT NULL,
  owner_id VARCHAR(20) NULL,
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_owner_id (owner_id),
  INDEX idx_users_role (role),
  INDEX idx_users_name (name),
  INDEX idx_users_email (email),
  INDEX idx_users_address (address),
  INDEX idx_users_owner_id (owner_id)
);


CREATE TABLE IF NOT EXISTS stores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(100) NOT NULL,
  address VARCHAR(400),
  owner_id INT,
  UNIQUE KEY uq_stores_email (email),
  INDEX idx_stores_name (name),
  INDEX idx_stores_email (email),
  INDEX idx_stores_address (address),
  INDEX idx_stores_owner (owner_id),
  CONSTRAINT fk_stores_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  store_id INT NOT NULL,
  rating INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT fk_ratings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ratings_store FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY uniq_user_store (user_id, store_id),
  INDEX idx_ratings_user (user_id),
  INDEX idx_ratings_store (store_id),
  INDEX idx_ratings_created_at (created_at)
);


INSERT INTO stores (name, email, address, owner_id) VALUES
  ('Sharma Kirana & General Store', 'sharma.kirana.kolhapur@example.com', 'Kolhapur, Maharashtra', NULL),
  ('Patil Super Mart', 'patil.supermart.sangli@example.com', 'Sangli, Maharashtra', NULL),
  ('Deshmukh Fresh & Daily Needs', 'deshmukh.daily.satara@example.com', 'Satara, Maharashtra', NULL),
  ('Joshi Provisions & More', 'joshi.provisions.pune@example.com', 'Pune, Maharashtra', NULL),
  ('Mehta Departmental Store', 'mehta.departmental.mumbai@example.com', 'Mumbai, Maharashtra', NULL);