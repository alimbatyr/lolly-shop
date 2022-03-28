CREATE DATABASE shop;
\connect shop;

CREATE TABLE users (
  userid TEXT PRIMARY KEY NOT NULL,
  password TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT NOW()::text
);

INSERT INTO users (userid, password) VALUES ('admin', '$2b$10$eBKoOnXMVIpg2qF4./WBF.nv.ltc04WXhCQ9CUJ58V54DWThX29/6');

CREATE TABLE products (
  product_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price int NOT NULL,
  amount int NOT NULL,
  colors TEXT[], -- colors is an array of hex or rgba values --
  sizes TEXT[], -- sizes is an array of size values --
  userid TEXT NOT NULL REFERENCES users(userid),
  created_at TEXT NOT NULL DEFAULT NOW()::text
);

CREATE TABLE images (
  image_id SERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  filepath TEXT NOT NULL,
  mimetype TEXT NOT NULL,
  size BIGINT NOT NULL,
  product_id INT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
  originalname TEXT NOT NULL
);

CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE product_categories (
  product_id INT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
  category_id INT NOT NULL REFERENCES categories(category_id) ON DELETE CASCADE
);