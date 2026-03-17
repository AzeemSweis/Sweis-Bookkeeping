import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { safeJson, serverError } from "@/lib/api-helpers";

export async function GET() {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await sql`SELECT * FROM testimonials ORDER BY sort_order ASC`;
    return NextResponse.json(result.rows);
  } catch (err) {
    return serverError("admin/testimonials GET", err);
  }
}

export async function POST(request: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await safeJson(request);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { client_name, company, quote } = body as { client_name?: string; company?: string; quote?: string };
  if (!client_name?.toString().trim() || !company?.toString().trim() || !quote?.toString().trim()) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  try {
    const maxResult = await sql`SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM testimonials`;
    const nextOrder = maxResult.rows[0].next_order;

    const result = await sql`
      INSERT INTO testimonials (client_name, company, quote, sort_order)
      VALUES (${client_name.toString().trim()}, ${company.toString().trim()}, ${quote.toString().trim()}, ${nextOrder})
      RETURNING *
    `;
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    return serverError("admin/testimonials POST", err);
  }
}
