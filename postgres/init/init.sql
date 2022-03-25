CREATE DATABASE shop;
\connect shop;

CREATE TABLE users (
  userid VARCHAR(255) PRIMARY KEY NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO users (userid, password) VALUES ('admin', '$2b$10$eBKoOnXMVIpg2qF4./WBF.nv.ltc04WXhCQ9CUJ58V54DWThX29/6');

CREATE TABLE products (
  product_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  images TEXT[], -- array of image ids
  colors TEXT[], -- colors is an array of hex or rgba values --
  sizes TEXT[], -- sizes is an array of size values --
  userid VARCHAR(255) NOT NULL REFERENCES users(userid),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE images (
  image_id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  filepath VARCHAR(255) NOT NULL,
  mimetype VARCHAR(255) NOT NULL,
  size INTEGER NOT NULL
);
