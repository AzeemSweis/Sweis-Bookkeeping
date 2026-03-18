import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { serverError } from "@/lib/api-helpers";

export async function GET() {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await sql`
      SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 200
    `;
    return NextResponse.json(result.rows);
  } catch (err) {
    return serverError("admin/submissions GET", err);
  }
}
