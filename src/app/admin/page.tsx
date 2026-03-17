import Link from "next/link";
import { sql } from "@/lib/db";

async function getSubmissionCount(): Promise<number> {
  try {
    const result = await sql`SELECT COUNT(*) AS count FROM contact_submissions`;
    return Number(result.rows[0]?.count ?? 0);
  } catch {
    return 0;
  }
}

const QUICK_LINKS = [
  { label: "Manage Testimonials", href: "/admin/testimonials", desc: "Add, edit, or remove client testimonials" },
  { label: "Edit Pricing", href: "/admin/pricing", desc: "Update tier names, prices, and features" },
  { label: "Edit Bio", href: "/admin/bio", desc: "Update your About section and headshot" },
  { label: "Contact Info", href: "/admin/contact-info", desc: "Update your phone number and email" },
  { label: "View Submissions", href: "/admin/submissions", desc: "Read incoming contact form messages" },
];

export default async function AdminDashboard() {
  const submissionCount = await getSubmissionCount();

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-heading text-navy text-2xl sm:text-3xl font-bold mb-2">
          Dashboard
        </h1>
        <p className="font-body text-text-secondary text-sm">
          Welcome back. Manage your site content below.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <p className="font-body text-text-secondary text-xs font-medium uppercase tracking-wider mb-1">
            Contact Submissions
          </p>
          <p className="font-heading text-navy text-4xl font-bold">{submissionCount}</p>
          <Link
            href="/admin/submissions"
            className="font-body text-gold text-xs hover:underline mt-2 inline-block"
          >
            View all
          </Link>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <p className="font-body text-text-secondary text-xs font-medium uppercase tracking-wider mb-1">
            Public Site
          </p>
          <p className="font-body text-text-primary text-sm mt-2">hannasweis.com</p>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-gold text-xs hover:underline mt-2 inline-block"
          >
            View site
          </a>
        </div>
      </div>

      {/* Quick links */}
      <h2 className="font-heading text-navy text-lg font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {QUICK_LINKS.map(({ label, href, desc }) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:border-gold hover:shadow-md transition-all group"
          >
            <p className="font-body text-navy font-semibold text-sm group-hover:text-gold transition-colors mb-1">
              {label}
            </p>
            <p className="font-body text-text-secondary text-xs">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
