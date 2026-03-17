import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendContactNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed, remaining } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429, headers: { "X-RateLimit-Remaining": String(remaining) } }
    );
  }

  let body: { name?: string; email?: string; phone?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, phone, message } = body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }

  if (name.trim().length > 100 || email.trim().length > 200 || (phone && phone.trim().length > 20) || message.trim().length > 5000) {
    return NextResponse.json({ error: "One or more fields exceed the maximum length." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  try {
    await sql`
      INSERT INTO contact_submissions (name, email, phone, message)
      VALUES (${name.trim()}, ${email.trim()}, ${phone?.trim() ?? null}, ${message.trim()})
    `;

    // Send email notification — don't block the response on failure
    sendContactNotification({ name: name.trim(), email: email.trim(), phone: phone?.trim(), message: message.trim() }).catch((err) => {
      console.error("[contact] Email notification failed:", err);
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] Failed to store submission:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
