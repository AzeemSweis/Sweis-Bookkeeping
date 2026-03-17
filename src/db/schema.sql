-- Sweis Bookkeeping Database Schema
-- Run via scripts/seed.ts

-- Key-value store for singleton site content (bio, contact info, etc.)
CREATE TABLE IF NOT EXISTS site_config (
  id         SERIAL PRIMARY KEY,
  key        VARCHAR(50) UNIQUE NOT NULL,
  value      TEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Pricing tiers (Silver, Gold, Platinum)
CREATE TABLE IF NOT EXISTS pricing_tiers (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(50) NOT NULL,
  price      INTEGER NOT NULL,   -- monthly price in dollars
  features   JSONB NOT NULL DEFAULT '[]',
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Supplementary notes displayed below pricing tiers
CREATE TABLE IF NOT EXISTS pricing_notes (
  id         SERIAL PRIMARY KEY,
  text       TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Client testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id          SERIAL PRIMARY KEY,
  client_name VARCHAR(100) NOT NULL,
  company     VARCHAR(200) NOT NULL,
  quote       TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Contact form submissions from the public site
CREATE TABLE IF NOT EXISTS contact_submissions (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(200) NOT NULL,
  phone      VARCHAR(20),
  message    TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Admin users (single user for content management)
CREATE TABLE IF NOT EXISTS admin_users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);
