-- Sweis Bookkeeping Seed Data
-- Run via scripts/seed.ts (after schema.sql)

-- Clear existing seed data for idempotent re-runs
TRUNCATE testimonials, pricing_tiers, pricing_notes, site_config RESTART IDENTITY;

-- ============================================================
-- TESTIMONIALS
-- ============================================================
INSERT INTO testimonials (client_name, company, quote, sort_order, is_active) VALUES
(
  'Ghassan Khalaf, DDS',
  'Aura Dental, Las Vegas',
  'Hanna has been my bookkeeper for the last twelve years. He is very organized, meticulous, and professional. Hanna quickly understood my business and immediately provided me with improvements on how I can run my practice better. I highly recommend Hanna''s Bookkeeping Service.',
  1,
  TRUE
),
(
  'Pastor Nadim Abou Zeid',
  'St. Sharbel Church, Las Vegas',
  'I''ve known and worked with Hanna for more than 13 years. Hanna is well known and respected in the community. He has a high code of conduct, morals, and ethics in accounting and Finance. He is very honest, transparent, and meticulous when it comes to his work. Hanna is an excellent bookkeeper and treats his clients with the highest respect, confidentiality, and loyalty. I highly recommend his services for business and personal matters.',
  2,
  TRUE
),
(
  'Imad Backley',
  'Repair Envy LLC, Las Vegas',
  'For the last 4 years, Hanna''s services to my company have been invaluable. He helps us with many tasks, and even going above and beyond to assist my company with duties outside of his job description.',
  3,
  TRUE
),
(
  'Salem Takriti',
  'Drive & Go LLC, Las Vegas',
  'Hanna has been of great value to my company. He points out many expenses, items, and trends on the monthly reports he gives me that I wouldn''t have been able to identify without his work.',
  4,
  TRUE
);

-- ============================================================
-- PRICING TIERS
-- ============================================================
INSERT INTO pricing_tiers (name, price, features, sort_order) VALUES
(
  'Silver',
  400,
  '["Reconciliation of Bank, Credit Card, and Loan Accounts (Up to 4 Accounts)", "Monthly Financial Reports", "Year end closing of all accounts", "Act as your trusted partner providing you financial reports, feedback and guidance"]',
  1
),
(
  'Gold',
  600,
  '["ALL Silver Tier Services", "Monthly and Quarterly Tax Forms (e.g. Sales and Modified)", "Accurate categorization of business Income & Expenses", "Simple Inventory"]',
  2
),
(
  'Platinum',
  1000,
  '["ALL Gold & Silver Tier Services", "Payroll (Up to 4 Employees)", "Personal Finances (Up to 3 Accounts)", "Inventory Tracking (Wholesale Only)"]',
  3
);

-- ============================================================
-- PRICING NOTES
-- ============================================================
INSERT INTO pricing_notes (text, sort_order) VALUES
('An initial set-up fee if no previous accounting system is in place.', 1),
('Above prices and services can be tailored to your specific needs.', 2),
('Personal finances starting at $75/mo for up to 4 accounts.', 3);

-- ============================================================
-- SITE CONFIG
-- ============================================================
INSERT INTO site_config (key, value) VALUES
(
  'bio_heading',
  'About Me'
),
(
  'bio_text_1',
  'My name is Hanna Sweis. I have lived in Las Vegas, Nevada for over 20 years. I have a family of five - including a beautiful dog.'
),
(
  'bio_text_2',
  'After many years working in IT, Financial Planning, Insurance, Real estate investment, Retail and Wholesale, I found my passion (in addition to hiking) in helping small business owners keeping their balance and sanity. With almost 20 years of experience in Bookkeeping I''d love to show you how I can help you stay on top of your finances, save you valuable time and keep you in the Black.'
),
(
  'bookkeeping_heading',
  'Bookkeeping'
),
(
  'bookkeeping_text',
  'Growing your Business should be your main focus and highest priority. Are you spending hours and hours working on your books instead of focusing on growing your Business? Then let me help you save your time to focus on that priority. Here are some of the things that I will do for you:'
),
(
  'bookkeeping_services',
  '["Accurate record keeping and organization", "Use QuickBooks Desktop or QuickBooks Online for all accounting and financials", "Payroll", "Manage Cash Flow", "Monitor Expenses and Improve Profits", "Reduce Taxes and Tax Planning", "Monthly and Annual Profit & Loss and Balance Sheet reports", "Quarterly and Year End Tax preparation and filing*"]'
),
(
  'bookkeeping_footnote',
  '*Filing your Tax Returns in association with Columbia Business Services or with your favorite CPA.'
),
(
  'phone',
  '(702) 526-5954'
),
(
  'email',
  'hssweis@gmail.com'
),
(
  'headshot_url',
  '/images/headshot.png'
),
(
  'contact_heading',
  'Get In Touch'
);
