import { sql } from "@/lib/db";
import { Navbar } from "@/components/public/Navbar";
import { Hero } from "@/components/public/Hero";
import { About } from "@/components/public/About";
import { Pricing } from "@/components/public/Pricing";
import { Testimonials } from "@/components/public/Testimonials";
import { ContactForm } from "@/components/public/ContactForm";
import { Footer } from "@/components/public/Footer";
import { ScrollToTop } from "@/components/public/ScrollToTop";

// ---- Fallback data (from seed) ----

const FALLBACK_CONFIG: Record<string, string> = {
  bio_heading: "About Me",
  bio_text_1:
    "My name is Hanna Sweis. I have lived in Las Vegas, Nevada for over 20 years. I have a family of five - including a beautiful dog.",
  bio_text_2:
    "After many years working in IT, Financial Planning, Insurance, Real estate investment, Retail and Wholesale, I found my passion (in addition to hiking) in helping small business owners keeping their balance and sanity. With almost 20 years of experience in Bookkeeping I'd love to show you how I can help you stay on top of your finances, save you valuable time and keep you in the Black.",
  bookkeeping_heading: "Bookkeeping",
  bookkeeping_text:
    "Growing your Business should be your main focus and highest priority. Are you spending hours and hours working on your books instead of focusing on growing your Business? Then let me help you save your time to focus on that priority. Here are some of the things that I will do for you:",
  bookkeeping_services: JSON.stringify([
    "Accurate record keeping and organization",
    "Use QuickBooks Desktop or QuickBooks Online for all accounting and financials",
    "Payroll",
    "Manage Cash Flow",
    "Monitor Expenses and Improve Profits",
    "Reduce Taxes and Tax Planning",
    "Monthly and Annual Profit & Loss and Balance Sheet reports",
    "Quarterly and Year End Tax preparation and filing*",
  ]),
  bookkeeping_footnote:
    "*Filing your Tax Returns in association with Columbia Business Services or with your favorite CPA.",
  phone: "(702) 526-5954",
  email: "hssweis@gmail.com",
  headshot_url: "/images/headshot.png",
};

const FALLBACK_TIERS = [
  {
    id: 1,
    name: "Silver",
    price: 400,
    features: [
      "Reconciliation of Bank, Credit Card, and Loan Accounts (Up to 4 Accounts)",
      "Monthly Financial Reports",
      "Year end closing of all accounts",
      "Act as your trusted partner providing you financial reports, feedback and guidance",
    ],
    sort_order: 1,
  },
  {
    id: 2,
    name: "Gold",
    price: 600,
    features: [
      "ALL Silver Tier Services",
      "Monthly and Quarterly Tax Forms (e.g. Sales and Modified)",
      "Accurate categorization of business Income & Expenses",
      "Simple Inventory",
    ],
    sort_order: 2,
  },
  {
    id: 3,
    name: "Platinum",
    price: 1000,
    features: [
      "ALL Gold & Silver Tier Services",
      "Payroll (Up to 4 Employees)",
      "Personal Finances (Up to 3 Accounts)",
      "Inventory Tracking (Wholesale Only)",
    ],
    sort_order: 3,
  },
];

const FALLBACK_NOTES = [
  { id: 1, text: "An initial set-up fee if no previous accounting system is in place.", sort_order: 1 },
  { id: 2, text: "Above prices and services can be tailored to your specific needs.", sort_order: 2 },
  { id: 3, text: "Personal finances starting at $75/mo for up to 4 accounts.", sort_order: 3 },
];

const FALLBACK_TESTIMONIALS = [
  {
    id: 1,
    client_name: "Ghassan Khalaf, DDS",
    company: "Aura Dental, Las Vegas",
    quote:
      "Hanna has been my bookkeeper for the last twelve years. He is very organized, meticulous, and professional. Hanna quickly understood my business and immediately provided me with improvements on how I can run my practice better. I highly recommend Hanna's Bookkeeping Service.",
  },
  {
    id: 2,
    client_name: "Pastor Nadim Abou Zeid",
    company: "St. Sharbel Church, Las Vegas",
    quote:
      "I've known and worked with Hanna for more than 13 years. Hanna is well known and respected in the community. He has a high code of conduct, morals, and ethics in accounting and Finance. He is very honest, transparent, and meticulous when it comes to his work. Hanna is an excellent bookkeeper and treats his clients with the highest respect, confidentiality, and loyalty. I highly recommend his services for business and personal matters.",
  },
  {
    id: 3,
    client_name: "Imad Backley",
    company: "Repair Envy LLC, Las Vegas",
    quote:
      "For the last 4 years, Hanna's services to my company have been invaluable. He helps us with many tasks, and even going above and beyond to assist my company with duties outside of his job description.",
  },
  {
    id: 4,
    client_name: "Salem Takriti",
    company: "Drive & Go LLC, Las Vegas",
    quote:
      "Hanna has been of great value to my company. He points out many expenses, items, and trends on the monthly reports he gives me that I wouldn't have been able to identify without his work.",
  },
];

// Revalidate cached page every 60 seconds (ISR)
export const revalidate = 60;

// ---- Data fetching helpers ----

async function getSiteConfig(): Promise<Record<string, string>> {
  try {
    const result = await sql`SELECT key, value FROM site_config`;
    return Object.fromEntries(result.rows.map((r) => [r.key as string, r.value as string]));
  } catch {
    return FALLBACK_CONFIG;
  }
}

async function getPricingTiers() {
  try {
    const result = await sql`SELECT * FROM pricing_tiers ORDER BY sort_order ASC`;
    return result.rows.map((r) => ({
      id: r.id as number,
      name: r.name as string,
      price: r.price as number,
      features: (typeof r.features === "string" ? JSON.parse(r.features) : r.features) as string[],
      sort_order: r.sort_order as number,
    }));
  } catch {
    return FALLBACK_TIERS;
  }
}

async function getPricingNotes() {
  try {
    const result = await sql`SELECT * FROM pricing_notes ORDER BY sort_order ASC`;
    return result.rows.map((r) => ({
      id: r.id as number,
      text: r.text as string,
      sort_order: r.sort_order as number,
    }));
  } catch {
    return FALLBACK_NOTES;
  }
}

async function getTestimonials() {
  try {
    const result = await sql`
      SELECT id, client_name, company, quote
      FROM testimonials
      WHERE is_active = TRUE
      ORDER BY sort_order ASC
    `;
    return result.rows.map((r) => ({
      id: r.id as number,
      client_name: r.client_name as string,
      company: r.company as string,
      quote: r.quote as string,
    }));
  } catch {
    return FALLBACK_TESTIMONIALS;
  }
}

// ---- Page ----

export default async function Home() {
  const [config, tiers, notes, testimonials] = await Promise.all([
    getSiteConfig(),
    getPricingTiers(),
    getPricingNotes(),
    getTestimonials(),
  ]);

  const services: string[] = (() => {
    try {
      const raw = config.bookkeeping_services;
      return raw ? JSON.parse(raw) : FALLBACK_CONFIG.bookkeeping_services ? JSON.parse(FALLBACK_CONFIG.bookkeeping_services) : [];
    } catch {
      return [];
    }
  })();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About
          heading={config.bio_heading ?? FALLBACK_CONFIG.bio_heading}
          text1={config.bio_text_1 ?? FALLBACK_CONFIG.bio_text_1}
          text2={config.bio_text_2 ?? FALLBACK_CONFIG.bio_text_2}
          bookkeepingHeading={config.bookkeeping_heading ?? FALLBACK_CONFIG.bookkeeping_heading}
          bookkeepingText={config.bookkeeping_text ?? FALLBACK_CONFIG.bookkeeping_text}
          services={services}
          footnote={config.bookkeeping_footnote ?? FALLBACK_CONFIG.bookkeeping_footnote}
          headshotUrl={config.headshot_url ?? FALLBACK_CONFIG.headshot_url}
        />
        <Pricing tiers={tiers} notes={notes} />
        <Testimonials testimonials={testimonials} />
        <ContactForm />
        <Footer
          phone={config.phone ?? FALLBACK_CONFIG.phone}
          email={config.email ?? FALLBACK_CONFIG.email}
        />
      </main>
      <ScrollToTop />
    </>
  );
}
