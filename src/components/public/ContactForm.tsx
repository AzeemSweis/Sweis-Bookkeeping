"use client";

import { useState } from "react";

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const INITIAL: FormState = { name: "", email: "", phone: "", message: "" };

export function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          message: form.message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setForm(INITIAL);
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    }
  };

  return (
    <section id="contact" className="bg-cool-gray py-20 lg:py-28">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-navy text-3xl sm:text-4xl font-bold mb-4">
            Add Me To Your Assets
          </h2>
          <p className="font-body text-text-secondary text-base sm:text-lg">
            Ready to take control of your finances? Let&apos;s talk.
          </p>
        </div>

        {status === "success" ? (
          <div
            className="bg-green-50 border border-green-200 rounded-xl p-8 text-center"
            role="alert"
          >
            <svg
              className="w-12 h-12 text-green-500 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="font-heading text-navy text-xl font-bold mb-2">
              Message Sent!
            </h3>
            <p className="font-body text-text-secondary">
              Thank you for reaching out. I&apos;ll be in touch shortly.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-6 font-body text-sm font-medium text-navy hover:text-gold transition-colors underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-white rounded-2xl shadow-sm p-8 sm:p-10 space-y-6"
          >
            <div>
              <label
                htmlFor="contact-name"
                className="block font-body text-sm font-medium text-text-primary mb-1.5"
              >
                Name <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
                className="w-full font-body text-sm border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent placeholder-gray-400 transition"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="block font-body text-sm font-medium text-text-primary mb-1.5"
              >
                Email <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="w-full font-body text-sm border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent placeholder-gray-400 transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="contact-phone"
                className="block font-body text-sm font-medium text-text-primary mb-1.5"
              >
                Phone{" "}
                <span className="text-text-secondary font-normal">(optional)</span>
              </label>
              <input
                id="contact-phone"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
                className="w-full font-body text-sm border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent placeholder-gray-400 transition"
                placeholder="(702) 555-0000"
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block font-body text-sm font-medium text-text-primary mb-1.5"
              >
                Message <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full font-body text-sm border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent placeholder-gray-400 transition resize-none"
                placeholder="Tell me about your business and what you need..."
              />
            </div>

            {status === "error" && (
              <div
                className="bg-red-50 border border-red-200 rounded-lg px-4 py-3"
                role="alert"
              >
                <p className="font-body text-red-700 text-sm">{errorMsg}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full font-body font-semibold text-navy bg-gold hover:bg-gold-light disabled:bg-gold/60 disabled:cursor-not-allowed px-6 py-3 rounded-lg tracking-wider uppercase text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
