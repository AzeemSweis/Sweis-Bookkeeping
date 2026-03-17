import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { parseId, badId, safeJson, serverError } from "@/lib/api-helpers";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) return badId();

  const body = await safeJson(request);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { text } = body as { text?: string };
  if (!text?.toString().trim()) {
    return NextResponse.json({ error: "Text is required." }, { status: 400 });
  }

  try {
    const result = await sql`
      UPDATE pricing_notes SET
        text = ${text.toString().trim()},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    return serverError("admin/pricing/notes PUT", err);
  }
}
