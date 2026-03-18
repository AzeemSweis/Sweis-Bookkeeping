# Sweis Bookkeeping

Modernized marketing website and admin panel for Hanna Sweis, a Las Vegas-based bookkeeper. Built with Next.js, Tailwind, Vercel Postgres, and deployed on Vercel.

## Quick Start

```bash
git clone https://github.com/azeem/sweis-bookkeeping.git
cd sweis-bookkeeping
npm install
cp .env.example .env.local
make dev
```

The public site runs at `http://localhost:3000`. The admin panel is at `/admin` (login page will appear; default credentials from `.env.local`).

Note: Full functionality (database, email, image uploads) requires external services configured (see Environment Variables below). Without them, the site falls back to hardcoded data.

## What It Does

The public marketing site showcases bookkeeping services with sections for hero, about, pricing, testimonials, and a contact form. Behind the scenes, an authenticated admin panel at `/admin` lets Hanna manage all content: edit pricing tiers, manage testimonials, update bio/headshot, view contact form submissions, and update contact info. All data is stored in Vercel Postgres and served via Next.js Server Components.

## Tech Stack

- **Next.js 16** (App Router, SSR)
- **React 19** + **Tailwind CSS 4**
- **Vercel Postgres** (database)
- **Vercel Blob** (admin image uploads)
- **NextAuth.js v5** (admin authentication)
- **Resend** (transactional email)
- **TypeScript**, **bcryptjs** (password hashing)

## Development

### Prerequisites

- Node.js 20+
- npm 10+

### Setup

```bash
npm install
```

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

You'll need:
- `POSTGRES_URL` — Vercel Postgres connection string (or leave blank for hardcoded fallback)
- `NEXTAUTH_SECRET` — Generate with `openssl rand -base64 32`
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` — Credentials for admin login
- `RESEND_API_KEY` — Resend API key (optional; contact form will fail gracefully without it)
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob token (optional; image uploads will fail without it)

See `.env.example` for all variables.

### Running

```bash
make dev
```

Starts dev server at `http://localhost:3000`. Edit `src/` and the site reloads automatically.

### Testing

```bash
make typecheck    # Type-check all TypeScript
make lint         # Run ESLint
```

No unit tests yet. Manual testing covers:
- Public page responsiveness (mobile, tablet, desktop)
- Admin login and content management flows
- Contact form submission
- Admin image upload to Vercel Blob

## Makefile Targets

| Target      | Description                                        |
|-------------|---------------------------------------------------|
| `help`      | Show all available targets                         |
| `dev`       | Start Next.js dev server                          |
| `build`     | Production build                                  |
| `start`     | Start production server (requires `build` first)  |
| `lint`      | Run ESLint                                        |
| `typecheck` | Type-check TypeScript without emitting            |
| `install`   | Install dependencies                             |
| `clean`     | Remove `.next/` and `node_modules/`              |
| `seed`      | Seed database with schema and initial data       |

## Environment Variables

See `.env.example` for the complete list. Key variables:

- `POSTGRES_URL` — Vercel Postgres connection string. Without it, the app uses hardcoded fallback data.
- `NEXTAUTH_SECRET` — Secret for session encryption. Generate with `openssl rand -base64 32`.
- `NEXTAUTH_URL` — Set to `https://hannasweis.com` in production; `http://localhost:3000` in development (auto-detected).
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` — Admin login credentials. Hashed into the database at seed time.
- `RESEND_API_KEY` — Email API key. Get from [resend.com](https://resend.com).
- `CONTACT_EMAIL` — Where contact form submissions are sent (default: `hssweis@gmail.com`).
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob token for image uploads.

## Database Setup

### Initial Seed

To populate the database with schema and seed data (testimonials, pricing tiers, bio content):

```bash
make seed
```

This runs `scripts/seed.ts`, which executes `db/schema.sql` and `db/seed.sql` against your Vercel Postgres connection.

Environment variables required:
- `POSTGRES_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

Example:

```bash
POSTGRES_URL="postgresql://..." ADMIN_USERNAME=admin ADMIN_PASSWORD=mysecret make seed
```

### Tables

- `site_config` — Key-value store for bio text, contact info, etc.
- `pricing_tiers` — Service tiers (Silver, Gold, Platinum) with features and pricing.
- `pricing_notes` — Notes displayed below pricing table.
- `testimonials` — Client testimonials, managed via admin panel.
- `contact_submissions` — Submissions from the public contact form.
- `admin_users` — Admin credentials (username + hashed password).

See `SPEC.md` for full schema details.

## Admin Panel

Access at `/admin` (not linked from the public site).

### Login

Default credentials from `.env.local`:
- Username: `ADMIN_USERNAME`
- Password: `ADMIN_PASSWORD`

### Features

- **Dashboard** — Overview of recent submissions.
- **Testimonials** — Add, edit, sort, and toggle active/inactive status.
- **Pricing** — Edit tier names, prices, and features; manage pricing notes.
- **Bio** — Edit about section text and upload/replace headshot image (stored in Vercel Blob).
- **Contact Info** — Update phone number and email address.
- **Submissions** — View contact form submissions (read-only).

All changes are persisted to the database immediately.

## Deployment

### Production Setup

1. Create a private GitHub repository:

```bash
gh repo create sweis-bookkeeping --private --source=. --push
```

2. Link to Vercel:
   - Go to [vercel.com](https://vercel.com) and import the repository.
   - Vercel auto-detects Next.js and sets defaults.

3. Set environment variables in the Vercel Dashboard:
   - `POSTGRES_URL` — Vercel Postgres connection string.
   - `NEXTAUTH_SECRET` — Generate a new secret with `openssl rand -base64 32`.
   - `NEXTAUTH_URL` — Set to `https://hannasweis.com`.
   - `ADMIN_USERNAME` / `ADMIN_PASSWORD` — Choose admin credentials.
   - `RESEND_API_KEY` — Resend API key.
   - `BLOB_READ_WRITE_TOKEN` — Vercel Blob token.

4. Connect custom domain:
   - In Vercel Dashboard, add custom domain `hannasweis.com`.
   - Update DNS at registrar to point to Vercel's nameservers.

5. Seed the production database:

```bash
POSTGRES_URL="<production-url>" ADMIN_USERNAME=admin ADMIN_PASSWORD=<secure-password> npx tsx scripts/seed.ts
```

Or run from CI/CD after deploying.

### Custom Domain

The production site is deployed at `hannasweis.com`. DNS and SSL are managed by Vercel (automatic).

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with fonts, nav, footer
│   ├── page.tsx                # Public single-page site (Hero, About, Pricing, Testimonials, Contact)
│   ├── globals.css             # Tailwind imports + custom utilities
│   ├── api/
│   │   ├── contact/route.ts    # POST contact form (stores in DB, sends email)
│   │   ├── auth/               # NextAuth routes
│   │   └── admin/              # Admin API routes (all require auth)
│   │       ├── testimonials/   # CRUD testimonials
│   │       ├── pricing/        # Manage pricing tiers and notes
│   │       ├── site-config/    # Edit bio, contact info, etc.
│   │       ├── upload/         # Upload images to Vercel Blob
│   │       └── submissions/    # View contact form submissions
│   └── admin/
│       ├── layout.tsx          # Auth gate, sidebar nav
│       ├── page.tsx            # Dashboard
│       ├── testimonials/       # Manage testimonials UI
│       ├── pricing/            # Edit pricing UI
│       ├── bio/                # Edit bio + headshot UI
│       ├── contact-info/       # Edit phone/email UI
│       ├── submissions/        # View submissions UI
│       └── login/              # Login form
├── components/
│   ├── public/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Pricing.tsx
│   │   ├── Testimonials.tsx
│   │   ├── ContactForm.tsx
│   │   ├── Footer.tsx
│   │   └── ScrollToTop.tsx
│   └── admin/
│       ├── Sidebar.tsx
│       ├── TestimonialForm.tsx
│       ├── PricingEditor.tsx
│       ├── BioEditor.tsx
│       └── ImageUpload.tsx
├── lib/
│   ├── db.ts                  # Vercel Postgres client and query helpers
│   ├── auth.ts                # NextAuth configuration
│   ├── email.ts               # Resend email client
│   └── rate-limit.ts          # IP-based rate limiter (5 contact submissions/hour)
└── db/
    ├── schema.sql             # Table definitions
    └── seed.sql               # Initial seed data

scripts/
└── seed.ts                     # Programmatic seeder (runs schema.sql + seed.sql)

public/
├── images/
│   ├── hannaBG.jpg            # Hero background (optimized)
│   └── motto.png              # Decorative image
├── og-image.jpg               # Open Graph preview image
└── favicon.ico
```

## Key Design Decisions

See `SPEC.md` for full rationale. Quick summary:

- **Next.js App Router** — Server Components for better SEO and performance on the public site.
- **Vercel Postgres** — Managed, serverless-friendly, free tier sufficient for a marketing site.
- **Single-page public, multi-page admin** — Public site is a scroll-through experience; admin uses standard pages for each management area.
- **`site_config` key-value table** — Simpler than creating separate tables for bio, contact, etc.
- **Pricing in database** — Hanna can update pricing without code deploys.
- **No public link to admin** — Admin panel is accessed directly via URL, not linked from the public site.
- **Credentials provider (NextAuth)** — Simple single-user authentication. No OAuth needed.
- **IP-based rate limiting** — Simple, in-memory rate limiter (5 contact submissions per IP per hour) prevents spam without Redis.
- **Vercel Blob for uploads** — Admin-uploaded images stored in Vercel's CDN; public images in `public/` optimized at build time.

## Local Development Tips

- **Database fallback**: If `POSTGRES_URL` is not set, the app serves hardcoded data. Useful for quick UI prototyping without setting up Postgres.
- **Admin login**: Visit `/admin` and use credentials from `.env.local`. Session is stored in an HTTP-only cookie.
- **Image uploads**: Uploads to Vercel Blob during admin session. Requires `BLOB_READ_WRITE_TOKEN`.
- **Contact form**: Submissions stored in the database and email sent via Resend. Without email config, submissions still save to DB.

## License

Personal project. Not open source.
