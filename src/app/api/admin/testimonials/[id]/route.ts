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

  const { client_name, company, quote, is_active, sort_order } = body as Record<string, unknown>;

  try {
    const result = await sql`
      UPDATE testimonials SET
        client_name = COALESCE(${(client_name as string) ?? null}, client_name),
        company = COALESCE(${(company as string) ?? null}, company),
        quote = COALESCE(${(quote as string) ?? null}, quote),
        is_active = COALESCE(${(is_active as boolean) ?? null}, is_active),
        sort_order = COALESCE(${(sort_order as number) ?? null}, sort_order),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    return serverError("admin/testimonials PUT", err);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) return badId();

  try {
    const result = await sql`DELETE FROM testimonials WHERE id = ${id} RETURNING id`;
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return serverError("admin/testimonials DELETE", err);
  }
}
