"use client";

import { useState, useEffect, useCallback } from "react";

interface Testimonial {
  id: number;
  client_name: string;
  company: string;
  quote: string;
  is_active: boolean;
  sort_order: number;
}

interface FormState {
  client_name: string;
  company: string;
  quote: string;
}

const EMPTY_FORM: FormState = { client_name: "", company: "", quote: "" };

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials");
      if (!res.ok) throw new Error("Failed to load");
      setTestimonials(await res.json());
    } catch {
      setError("Failed to load testimonials.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const startEdit = (t: Testimonial) => {
    setEditId(t.id);
    setForm({ client_name: t.client_name, company: t.company, quote: t.quote });
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const url = editId
      ? `/api/admin/testimonials/${editId}`
      : "/api/admin/testimonials";
    const method = editId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to save.");
        return;
      }
      setSuccess(editId ? "Testimonial updated." : "Testimonial added.");
      setEditId(null);
      setForm(EMPTY_FORM);
      await load();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (t: Testimonial) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${t.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !t.is_active }),
      });
      if (!res.ok) throw new Error("Failed");
      await load();
    } catch {
      setError("Failed to update status.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this testimonial? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setSuccess("Testimonial deleted.");
      await load();
    } catch {
      setError("Failed to delete.");
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <h1 className="font-heading text-navy text-2xl sm:text-3xl font-bold mb-8">
        Testimonials
      </h1>

      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="font-heading text-navy text-lg font-bold mb-5">
          {editId ? "Edit Testimonial" : "Add Testimonial"}
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4" role="alert">
            <p className="font-body text-red-700 text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-4" role="status">
            <p className="font-body text-green-700 text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="t-client-name" className="block font-body text-sm font-medium text-text-primary mb-1.5">
                Client Name <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="t-client-name"
                type="text"
                name="client_name"
                value={form.client_name}
                onChange={handleChange}
                required
                className="w-full font-body text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="e.g. John Smith, DDS"
              />
            </div>
            <div>
              <label htmlFor="t-company" className="block font-body text-sm font-medium text-text-primary mb-1.5">
                Company <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="t-company"
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                required
                className="w-full font-body text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="e.g. Smith Dental, Las Vegas"
              />
            </div>
          </div>

          <div>
            <label htmlFor="t-quote" className="block font-body text-sm font-medium text-text-primary mb-1.5">
              Quote <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <textarea
              id="t-quote"
              name="quote"
              value={form.quote}
              onChange={handleChange}
              required
              rows={4}
              className="w-full font-body text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
              placeholder="Client testimonial text..."
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="font-body font-semibold text-navy bg-gold hover:bg-gold-light disabled:opacity-60 px-5 py-2 rounded-lg text-sm tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-gold"
            >
              {saving ? "Saving..." : editId ? "Update" : "Add Testimonial"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="font-body text-sm text-gray-500 hover:text-navy transition-colors px-4 py-2 rounded-lg border border-gray-200 hover:border-navy"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div>
        <h2 className="font-heading text-navy text-lg font-bold mb-4">
          Existing Testimonials ({testimonials.length})
        </h2>

        {loading ? (
          <p className="font-body text-text-secondary text-sm">Loading...</p>
        ) : testimonials.length === 0 ? (
          <p className="font-body text-text-secondary text-sm">No testimonials yet.</p>
        ) : (
          <div className="space-y-3">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className={`bg-white rounded-xl border shadow-sm p-5 ${
                  t.is_active ? "border-gray-100" : "border-gray-100 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-body text-navy font-semibold text-sm truncate">
                        {t.client_name}
                      </p>
                      <span
                        className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                          t.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {t.is_active ? "Active" : "Hidden"}
                      </span>
                    </div>
                    <p className="font-body text-text-secondary text-xs mb-2">{t.company}</p>
                    <p className="font-body text-text-primary text-sm line-clamp-2">&ldquo;{t.quote}&rdquo;</p>
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleActive(t)}
                      className="font-body text-xs text-gray-500 hover:text-navy transition-colors px-2 py-1 rounded border border-gray-200 hover:border-navy"
                      aria-label={t.is_active ? "Hide testimonial" : "Show testimonial"}
                    >
                      {t.is_active ? "Hide" : "Show"}
                    </button>
                    <button
                      type="button"
                      onClick={() => startEdit(t)}
                      className="font-body text-xs text-gold hover:text-navy transition-colors px-2 py-1 rounded border border-gold/30 hover:border-navy"
                      aria-label={`Edit ${t.client_name}`}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(t.id)}
                      className="font-body text-xs text-red-500 hover:text-red-700 transition-colors px-2 py-1 rounded border border-red-100 hover:border-red-300"
                      aria-label={`Delete ${t.client_name}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
