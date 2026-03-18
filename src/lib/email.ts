import { Resend } from "resend";

function getResend(): Resend {
  return new Resend(process.env.RESEND_API_KEY);
}

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export async function sendContactNotification(data: ContactFormData): Promise<void> {
  const contactEmail = process.env.CONTACT_EMAIL;
  if (!contactEmail) {
    console.error("[email] CONTACT_EMAIL not set, skipping notification");
    return;
  }

  await getResend().emails.send({
    from: "Sweis Bookkeeping <onboarding@resend.dev>",
    to: contactEmail,
    subject: `New Contact Form Submission from ${sanitizeSubject(data.name)}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      ${data.phone ? `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ""}
      <hr />
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(data.message)}</p>
    `,
  });
}

function sanitizeSubject(text: string): string {
  return text.replace(/[\r\n]/g, "").slice(0, 100);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
