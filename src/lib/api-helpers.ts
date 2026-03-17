import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export async function withAdminAuth<T>(
  handler: () => Promise<T>
): Promise<NextResponse | T> {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return handler();
}

export function parseId(id: string): number | null {
  const num = Number(id);
  if (!Number.isInteger(num) || num <= 0) return null;
  return num;
}

export function badId(): NextResponse {
  return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
}

export function serverError(context: string, err: unknown): NextResponse {
  console.error(`[${context}]`, err);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

export async function safeJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export const VALID_CONFIG_KEYS = new Set([
  "bio_heading",
  "bio_text_1",
  "bio_text_2",
  "bookkeeping_heading",
  "bookkeeping_text",
  "bookkeeping_services",
  "bookkeeping_footnote",
  "phone",
  "email",
  "headshot_url",
  "contact_heading",
]);
