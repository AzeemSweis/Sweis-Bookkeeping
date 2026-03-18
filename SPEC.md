# Project: Sweis Bookkeeping

## Overview

A modernized business website for Hanna Sweis, a bookkeeper based in Las Vegas. Replaces an existing static Bootstrap site with a Next.js application featuring a public marketing page and a hidden admin panel for content management. All public content (bio, pricing, testimonials, contact info) is database-driven and editable through the admin interface.

## Project Type

Webapp

## Tech Stack

- **Framework**: Next.js 14+ (App Router) — SSR for SEO, API routes for backend, single deployable unit on Vercel
- **Styling**: Tailwind CSS — utility-first, fast iteration, responsive design out of the box
- **Database**: Vercel Postgres (free tier) — managed Postgres accessible from serverless functions, no infra to maintain
- **Image Storage**: Vercel Blob — admin-uploaded images (headshot); static images in `public/`
- **Auth**: NextAuth.js v5 (Auth.js) with Credentials provider — single admin user, session-based
- **Email**: Resend (free tier) — contact form notifications to business owner
- **Deployment**: Vercel — custom domain hannasweis.com, automatic preview deployments
- **Fonts**: Google Fonts — PT Serif (headings), Montserrat (body) via `next/font`

## Design System

### Color Palette

| Token            | Value     | Usage                              |
| ---------------- | --------- | ---------------------------------- |
| `navy`           | `#1B2A4A` | Primary — nav, headings, footer    |
| `navy-light`     | `#2D4470` | Hover states, secondary elements   |
| `gold`           | `#D4AF37` | Accent — CTAs, pricing highlights  |
| `gold-light`     | `#E8D48B` | Subtle gold backgrounds            |
| `warm-white`     | `#FAF9F6` | Page background                    |
| `cool-gray`      | `#F3F4F6` | Section alternating background     |
| `text-primary`   | `#1F2937` | Body text                          |
| `text-secondary` | `#6B7280` | Supporting text                    |
| `silver`         | `#C0C0C0` | Silver tier header                 |
| `platinum`       | `#E5E4E2` | Platinum tier header               |

### Typography

- **Headings**: PT Serif, serif — conveys professionalism and trust
- **Body**: Montserrat, sans-serif — clean and readable
- **Scale**: Tailwind default type scale, with `text-5xl`+ for section headings

### Layout

- Single-page public site with smooth scroll navigation
- Sticky/fixed top navigation bar with section links
- Sections alternate between `warm-white` and `cool-gray` backgrounds
- Max content width of `max-w-6xl` (1152px) centered
- Mobile-first responsive design using Tailwind breakpoints
- Subtle fade-in-on-scroll animations via Intersection Observer

## Data Model

### `site_config` table

Stores singleton key-value content for the site.

| Column       | Type         | Notes                                     |
| ------------ | ------------ | ----------------------------------------- |
| `id`         | `serial PK`  |                                           |
| `key`        | `varchar(50)` | Unique — e.g. `bio_text`, `phone`, `email` |
| `value`      | `text`       | The content value                         |
| `updated_at` | `timestamp`  | Auto-updated                              |

**Seed keys**: `bio_heading`, `bio_text_1`, `bio_text_2`, `bookkeeping_heading`, `bookkeeping_text`, `bookkeeping_services` (JSON array), `bookkeeping_footnote`, `phone`, `email`, `headshot_url`, `contact_heading`

### `pricing_tiers` table

| Column       | Type         | Notes                                  |
| ------------ | ------------ | -------------------------------------- |
| `id`         | `serial PK`  |                                        |
| `name`       | `varchar(50)` | Silver, Gold, Platinum                |
| `price`      | `integer`    | Monthly price in dollars               |
| `features`   | `jsonb`      | Array of feature strings               |
| `sort_order` | `integer`    | Display order                          |
| `updated_at` | `timestamp`  |                                        |

### `pricing_notes` table

| Column       | Type         | Notes                   |
| ------------ | ------------ | ----------------------- |
| `id`         | `serial PK`  |                         |
| `text`       | `text`       | Note text               |
| `sort_order` | `integer`    | Display order           |
| `updated_at` | `timestamp`  |                         |

### `testimonials` table

| Column       | Type          | Notes                          |
| ------------ | ------------- | ------------------------------ |
| `id`         | `serial PK`   |                                |
| `client_name`| `varchar(100)` | e.g. "Ghassan Khalaf, DDS"   |
| `company`    | `varchar(200)` | e.g. "Aura Dental, Las Vegas" |
| `quote`      | `text`        | Testimonial text               |
| `sort_order` | `integer`     | Display order                  |
| `is_active`  | `boolean`     | Default true                   |
| `created_at` | `timestamp`   |                                |
| `updated_at` | `timestamp`   |                                |

### `contact_submissions` table

| Column       | Type          | Notes                     |
| ------------ | ------------- | ------------------------- |
| `id`         | `serial PK`   |                           |
| `name`       | `varchar(100)` |                          |
| `email`      | `varchar(200)` |                          |
| `phone`      | `varchar(20)`  | Optional                 |
| `message`    | `text`        |                           |
| `created_at` | `timestamp`   |                           |

### `admin_users` table

| Column          | Type          | Notes                |
| --------------- | ------------- | -------------------- |
| `id`            | `serial PK`   |                      |
| `username`      | `varchar(50)` | Unique               |
| `password_hash` | `varchar(255)` | bcrypt hash         |
| `created_at`    | `timestamp`   |                      |

## API Contract

### Public Routes (Server Components + API)

All public page content is fetched via Server Components using direct DB queries (no API routes needed for reads).

#### `POST /api/contact`

Submit contact form. Stores in DB and sends email via Resend.

```
Request:  { name: string, email: string, phone?: string, message: string }
Response: { success: true } | { error: string }
```

Rate limited: 5 submissions per IP per hour.

### Admin API Routes

All admin routes require authenticated session (NextAuth). Return 401 if unauthenticated.

#### `GET /api/admin/testimonials`

```
Response: Testimonial[]
```

#### `POST /api/admin/testimonials`

```
Request:  { client_name, company, quote }
Response: Testimonial
```

#### `PUT /api/admin/testimonials/:id`

```
Request:  { client_name?, company?, quote?, is_active?, sort_order? }
Response: Testimonial
```

#### `DELETE /api/admin/testimonials/:id`

```
Response: { success: true }
```

#### `GET /api/admin/pricing`

```
Response: { tiers: PricingTier[], notes: PricingNote[] }
```

#### `PUT /api/admin/pricing/tiers/:id`

```
Request:  { name?, price?, features? }
Response: PricingTier
```

#### `PUT /api/admin/pricing/notes/:id`

```
Request:  { text? }
Response: PricingNote
```

#### `GET /api/admin/site-config`

```
Response: Record<string, string>
```

#### `PUT /api/admin/site-config`

```
Request:  { key: string, value: string }
Response: { success: true }
```

#### `POST /api/admin/upload`

Upload image to Vercel Blob (headshot replacement).

```
Request:  FormData with file
Response: { url: string }
```

#### `GET /api/admin/submissions`

View contact form submissions.

```
Response: ContactSubmission[]
```

### Auth Routes (handled by NextAuth)

- `POST /api/auth/signin` — Login
- `POST /api/auth/signout` — Logout
- `GET /api/auth/session` — Session check

## File Structure

```
sweis-bookkeeping/
├── SPEC.md
├── README.md
├── Makefile
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.example              # POSTGRES_URL, NEXTAUTH_SECRET, RESEND_API_KEY, BLOB_READ_WRITE_TOKEN, ADMIN_USERNAME, ADMIN_PASSWORD
├── .gitignore
├── public/
│   ├── favicon.ico
│   ├── images/
│   │   ├── hannaBG.jpg       # Optimized hero background
│   │   └── motto.png         # Existing decorative image
│   └── og-image.jpg          # Open Graph preview image
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout: fonts, metadata, nav
│   │   ├── page.tsx          # Public single-page: Hero, About, Pricing, Testimonials, Contact
│   │   ├── globals.css       # Tailwind imports + custom utilities
│   │   ├── api/
│   │   │   ├── contact/
│   │   │   │   └── route.ts  # POST contact form
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   └── admin/
│   │   │       ├── testimonials/
│   │   │       │   └── route.ts       # GET, POST
│   │   │       ├── testimonials/[id]/
│   │   │       │   └── route.ts       # PUT, DELETE
│   │   │       ├── pricing/
│   │   │       │   └── route.ts       # GET
│   │   │       ├── pricing/tiers/[id]/
│   │   │       │   └── route.ts       # PUT
│   │   │       ├── pricing/notes/[id]/
│   │   │       │   └── route.ts       # PUT
│   │   │       ├── site-config/
│   │   │       │   └── route.ts       # GET, PUT
│   │   │       ├── upload/
│   │   │       │   └── route.ts       # POST
│   │   │       └── submissions/
│   │   │           └── route.ts       # GET
│   │   └── admin/
│   │       ├── layout.tsx             # Admin layout: auth gate, sidebar nav
│   │       ├── page.tsx               # Dashboard / overview
│   │       ├── login/
│   │       │   └── page.tsx           # Login form
│   │       ├── testimonials/
│   │       │   └── page.tsx           # Manage testimonials
│   │       ├── pricing/
│   │       │   └── page.tsx           # Edit pricing tiers and notes
│   │       ├── bio/
│   │       │   └── page.tsx           # Edit about section + headshot
│   │       ├── contact-info/
│   │       │   └── page.tsx           # Edit phone/email
│   │       └── submissions/
│   │           └── page.tsx           # View contact form submissions
│   ├── components/
│   │   ├── public/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── ContactForm.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ScrollToTop.tsx
│   │   └── admin/
│   │       ├── Sidebar.tsx
│   │       ├── TestimonialForm.tsx
│   │       ├── PricingEditor.tsx
│   │       ├── BioEditor.tsx
│   │       └── ImageUpload.tsx
│   ├── lib/
│   │   ├── db.ts              # Vercel Postgres client + query helpers
│   │   ├── auth.ts            # NextAuth config
│   │   ├── email.ts           # Resend client
│   │   └── rate-limit.ts      # Simple in-memory rate limiter
│   └── db/
│       ├── schema.sql         # Table definitions
│       └── seed.sql           # Initial data from existing site (typos fixed)
└── scripts/
    └── seed.ts                # Programmatic DB seeder (runs schema.sql + seed.sql)
```

## Seed Data

### Testimonials (typos fixed)

1. **Ghassan Khalaf, DDS** — Aura Dental, Las Vegas
   > "Hanna has been my bookkeeper for the last twelve years. He is very organized, meticulous, and professional. Hanna quickly understood my business and immediately provided me with improvements on how I can run my practice better. I highly recommend Hanna's Bookkeeping Service."

2. **Pastor Nadim Abou Zeid** — St. Sharbel Church, Las Vegas
   > "I've known and worked with Hanna for more than 13 years. Hanna is well known and respected in the community. He has a high code of conduct, morals, and ethics in accounting and Finance. He is very honest, transparent, and meticulous when it comes to his work. Hanna is an excellent bookkeeper and treats his clients with the highest respect, confidentiality, and loyalty. I highly recommend his services for business and personal matters."

3. **Imad Backley** — Repair Envy LLC, Las Vegas
   > "For the last 4 years, Hanna's services to my company have been invaluable. He helps us with many tasks, and even going above and beyond to assist my company with duties outside of his job description."

4. **Salem Takriti** — Drive & Go LLC, Las Vegas
   > "Hanna has been of great value to my company. He points out many expenses, items, and trends on the monthly reports he gives me that I wouldn't have been able to identify without his work."

### Pricing Tiers

| Tier     | Price    | Features                                                                                                                                                     |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Silver   | $400/mo  | Reconciliation of Bank, Credit Card, and Loan Accounts (Up to 4 Accounts); Monthly Financial Reports; Year end closing of all accounts; Act as your trusted partner providing you financial reports, feedback and guidance |
| Gold     | $600/mo  | ALL Silver Tier Services; Monthly and Quarterly Tax Forms (e.g. Sales and Modified); Accurate categorization of business Income & Expenses; Simple Inventory |
| Platinum | $1000/mo | ALL Gold & Silver Tier Services; Payroll (Up to 4 Employees); Personal Finances (Up to 3 Accounts); Inventory Tracking (Wholesale Only)                     |

### Pricing Notes

1. An initial set-up fee if no previous accounting system is in place.
2. Above prices and services can be tailored to your specific needs.
3. Personal finances starting at $75/mo for up to 4 accounts.

### Bio Content (typos fixed)

**About Me**: "My name is Hanna Sweis. I have lived in Las Vegas, Nevada for over 20 years. I have a family of five - including a beautiful dog."

**About Me (continued)**: "After many years working in IT, Financial Planning, Insurance, Real estate investment, Retail and Wholesale, I found my passion (in addition to hiking) in helping small business owners keeping their balance and sanity. With almost 20 years of experience in Bookkeeping I'd love to show you how I can help you stay on top of your finances, save you valuable time and keep you in the Black."

**Bookkeeping** (heading — fixed from "Bookeeping"): "Growing your Business should be your main focus and highest priority. Are you spending hours and hours working on your books instead of focusing on growing your Business? Then let me help you save your time to focus on that priority. Here are some of the things that I will do for you:"

**Services list** (typos fixed):
- Accurate record keeping and organization
- Use QuickBooks Desktop or QuickBooks Online for all accounting and financials
- Payroll
- Manage Cash Flow
- Monitor Expenses and Improve Profits
- Reduce Taxes and Tax Planning
- Monthly and Annual Profit & Loss and Balance Sheet reports
- Quarterly and Year End Tax preparation and filing*

**Footnote**: *Filing your Tax Returns in association with Columbia Business Services or with your favorite CPA.

### Contact Info

- **Phone**: (702) 526-5954
- **Email**: hssweis@gmail.com

## Key Decisions

1. **Next.js App Router over Pages Router** — Server Components allow fetching DB content without client-side loading states for the public page. Better SEO out of the box.
2. **Vercel Postgres over SQLite** — SQLite doesn't work in Vercel's serverless environment. Vercel Postgres is free-tier and managed.
3. **Single-page public site, multi-page admin** — The public site is a single scroll page (matches existing UX). The admin panel uses standard page navigation for each management area.
4. **`site_config` as key-value store** — Simpler than creating separate tables for bio, contact info, etc. All singleton content lives in one table.
5. **Pricing stored in DB, not hardcoded** — Business owner can update pricing without a code deploy.
6. **No public link to admin** — Admin panel is accessed directly via `/admin` URL. No navigation link exists on the public site.
7. **Resend for email** — Free tier (100 emails/day) is more than enough for a contact form. Simple REST API, official Next.js SDK.
8. **bcrypt for password hashing** — Admin password is hashed at seed time. Auth uses NextAuth Credentials provider comparing against the hash in `admin_users` table.
9. **Rate limiting on contact form** — Simple in-memory rate limiter (IP-based, 5/hour) to prevent spam. Acceptable for low-traffic site; no need for Redis.
10. **Images optimized at build time** — Existing 3.3MB headshot and 1.7MB background will be optimized and placed in `public/`. Admin-uploaded replacements go to Vercel Blob.

## Environment Variables

```
# Database
POSTGRES_URL=                    # Vercel Postgres connection string

# Auth
NEXTAUTH_SECRET=                 # Random secret for session encryption
NEXTAUTH_URL=https://hannasweis.com

# Admin credentials (used by seed script only)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=                  # Set during initial setup, hashed into DB

# Email
RESEND_API_KEY=                  # Resend API key
CONTACT_EMAIL=hssweis@gmail.com  # Where contact form submissions are sent

# Blob storage
BLOB_READ_WRITE_TOKEN=           # Vercel Blob token
```

## Implementation Order

1. **Project scaffold** — `create-next-app`, Tailwind config, fonts, color palette, Makefile, `.env.example`
2. **Database schema + seed** — Create `schema.sql`, `seed.sql`, and seed script. Run against Vercel Postgres (or local Postgres for dev).
3. **Public page — static layout** — Build all 6 sections as components with hardcoded content to nail the design first.
4. **Public page — database-driven** — Replace hardcoded content with Server Component DB queries.
5. **Contact form** — Build form component, API route, Resend integration, rate limiting, DB storage.
6. **Auth setup** — NextAuth config, Credentials provider, admin login page, session middleware.
7. **Admin panel — layout + routing** — Sidebar, auth gate, page shells for each management area.
8. **Admin — testimonials CRUD** — Full add/edit/delete with form validation.
9. **Admin — pricing editor** — Edit tier names, prices, features; edit notes.
10. **Admin — bio editor** — Edit text content, upload headshot to Vercel Blob.
11. **Admin — contact info + submissions** — Edit phone/email, view submitted messages.
12. **SEO + meta tags** — Open Graph, meta description, semantic HTML, structured data.
13. **Image optimization** — Optimize existing images, configure `next/image`, test Vercel Blob serving.
14. **Scroll animations** — Intersection Observer fade-in effects on sections.
15. **Testing + polish** — Mobile responsiveness, accessibility audit, cross-browser check, Lighthouse score.
16. **Deployment** — Vercel project setup, custom domain, environment variables, production seed.

## Out of Scope

- **Online payments / invoicing** — This is a marketing site, not a SaaS product.
- **Client portal / login** — No client-facing accounts or document sharing.
- **Blog / content marketing** — Not needed at launch. Could be added later.
- **Appointment scheduling** — Use Calendly or similar if needed; don't build it.
- **Analytics dashboard in admin** — Use Vercel Analytics or Google Analytics instead.
- **Multi-language support** — English only.
- **Automated backups** — Vercel Postgres handles this at the infrastructure level.
- **CMS integration** — The admin panel IS the CMS. No need for WordPress, Contentful, etc.
