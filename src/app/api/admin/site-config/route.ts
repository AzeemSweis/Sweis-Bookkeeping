import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { safeJson, serverError, VALID_CONFIG_KEYS } from "@/lib/api-helpers";

export async function GET() {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await sql`SELECT key, value FROM site_config ORDER BY key`;
    const config: Record<string, string> = {};
    for (const row of result.rows) {
      config[row.key as string] = row.value as string;
    }
    return NextResponse.json(config);
  } catch (err) {
    return serverError("admin/site-config GET", err);
  }
}

export async function PUT(request: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await safeJson(request);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { key, value } = body as { key?: string; value?: string };
  if (!key?.toString().trim()) {
    return NextResponse.json({ error: "Key is required." }, { status: 400 });
  }

  if (!VALID_CONFIG_KEYS.has(key.toString().trim())) {
    return NextResponse.json({ error: "Invalid config key." }, { status: 400 });
  }

  try {
    await sql`
      INSERT INTO site_config (key, value, updated_at)
      VALUES (${key.toString().trim()}, ${value ?? ""}, NOW())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
    `;
    return NextResponse.json({ success: true });
  } catch (err) {
    return serverError("admin/site-config PUT", err);
  }
}
