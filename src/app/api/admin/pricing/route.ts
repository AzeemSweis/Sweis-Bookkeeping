import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { serverError } from "@/lib/api-helpers";

export async function GET() {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [tiers, notes] = await Promise.all([
      sql`SELECT * FROM pricing_tiers ORDER BY sort_order ASC`,
      sql`SELECT * FROM pricing_notes ORDER BY sort_order ASC`,
    ]);

    // Normalize features to always be an array
    const normalizedTiers = tiers.rows.map((t) => ({
      ...t,
      features: typeof t.features === "string" ? JSON.parse(t.features) : t.features,
    }));

    return NextResponse.json({ tiers: normalizedTiers, notes: notes.rows });
  } catch (err) {
    return serverError("admin/pricing GET", err);
  }
}
