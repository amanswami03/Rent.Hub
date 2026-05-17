-- Create RentHub Schema for PostgreSQL

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  city VARCHAR(255),
  pincode VARCHAR(20),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Items Table
CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  period VARCHAR(50),
  image TEXT,
  rating DECIMAL(3, 1),
  reviews INT DEFAULT 0,
  owner VARCHAR(255),
  owner_id INT REFERENCES users(id),
  available BOOLEAN DEFAULT TRUE,
  city VARCHAR(255),
  pincode VARCHAR(20),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rentals Table
CREATE TABLE IF NOT EXISTS rentals (
  id SERIAL PRIMARY KEY,
  item_id INT NOT NULL REFERENCES items(id),
  renter_id INT NOT NULL REFERENCES users(id),
  owner_id INT NOT NULL REFERENCES users(id),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active',
  total_cost DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wishlists Table
CREATE TABLE IF NOT EXISTS wishlists (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  item_id INT NOT NULL REFERENCES items(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, item_id)
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  item_id INT NOT NULL REFERENCES items(id),
  user_id INT NOT NULL REFERENCES users(id),
  rating DECIMAL(3, 1) NOT NULL,
  comment TEXT,
  user_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for better query performance
CREATE INDEX idx_item_category ON items(category);
CREATE INDEX idx_item_owner ON items(owner_id);
CREATE INDEX idx_item_city ON items(city);
CREATE INDEX idx_rental_renter ON rentals(renter_id);
CREATE INDEX idx_rental_owner ON rentals(owner_id);
CREATE INDEX idx_wishlist_user ON wishlists(user_id);
CREATE INDEX idx_review_item ON reviews(item_id);
