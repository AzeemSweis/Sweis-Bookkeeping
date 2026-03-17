"use client";

import { useState, useEffect, useCallback } from "react";

export default function ContactInfoPage() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingPhone, setSavingPhone] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [phoneStatus, setPhoneStatus] = useState("");
  const [emailStatus, setEmailStatus] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/site-config");
      if (!res.ok) throw new Error("Failed");
      const data: Record<string, string> = await res.json();
      setPhone(data.phone ?? "");
      setEmail(data.email ?? "");
    } catch {
      setPhoneStatus("Failed to load contact info.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveField = async (
    key: "phone" | "email",
    value: string,
    setSaving: (v: boolean) => void,
    setStatusMsg: (v: string) => void
  ) => {
    setSaving(true);
    setStatusMsg("");
    try {
      const res = await fetch("/api/admin/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatusMsg("Saved.");
    } catch {
      setStatusMsg("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-10">
        <p className="font-body text-text-secondary text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-xl">
      <h1 className="font-heading text-navy text-2xl sm:text-3xl font-bold mb-8">
        Contact Info
      </h1>

      <div className="space-y-6">
        {/* Phone */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <label
            htmlFor="ci-phone"
            className="block font-body text-sm font-medium text-text-primary mb-1.5"
          >
            Phone Number
          </label>
          <input
            id="ci-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            className="w-full font-body text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            placeholder="(702) 555-0000"
          />
          <div className="flex items-center gap-3 mt-3">
            <button
              type="button"
              onClick={() => saveField("phone", phone, setSavingPhone, setPhoneStatus)}
              disabled={savingPhone}
              className="font-body font-semibold text-navy bg-gold hover:bg-gold-light disabled:opacity-60 px-4 py-1.5 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-gold"
            >
              {savingPhone ? "Saving..." : "Save Phone"}
            </button>
            {phoneStatus && (
              <p
                className={`font-body text-xs ${
                  phoneStatus === "Saved." ? "text-green-600" : "text-red-600"
                }`}
                role="status"
              >
                {phoneStatus}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <label
            htmlFor="ci-email"
            className="block font-body text-sm font-medium text-text-primary mb-1.5"
          >
            Email Address
          </label>
          <input
            id="ci-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full font-body text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            placeholder="you@example.com"
          />
          <div className="flex items-center gap-3 mt-3">
            <button
              type="button"
              onClick={() => saveField("email", email, setSavingEmail, setEmailStatus)}
              disabled={savingEmail}
              className="font-body font-semibold text-navy bg-gold hover:bg-gold-light disabled:opacity-60 px-4 py-1.5 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-gold"
            >
              {savingEmail ? "Saving..." : "Save Email"}
            </button>
            {emailStatus && (
              <p
                className={`font-body text-xs ${
                  emailStatus === "Saved." ? "text-green-600" : "text-red-600"
                }`}
                role="status"
              >
                {emailStatus}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
