"use client";

import { useState, useEffect, useCallback } from "react";

interface PricingTier {
  id: number;
  name: string;
  price: number;
  features: string[];
  sort_order: number;
}

interface PricingNote {
  id: number;
  text: string;
  sort_order: number;
}

export default function PricingPage() {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [notes, setNotes] = useState<PricingNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pricing");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setTiers(data.tiers ?? []);
      setNotes(data.notes ?? []);
    } catch {
      setStatus((s) => ({ ...s, global: "Failed to load pricing data." }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveTier = async (tier: PricingTier) => {
    const key = `tier-${tier.id}`;
    setSaving((s) => ({ ...s, [key]: true }));
    setStatus((s) => ({ ...s, [key]: "" }));
    try {
      const res = await fetch(`/api/admin/pricing/tiers/${tier.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tier.name, price: tier.price, features: tier.features }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus((s) => ({ ...s, [key]: "Saved." }));
      await load();
    } catch {
      setStatus((s) => ({ ...s, [key]: "Save failed." }));
    } finally {
      setSaving((s) => ({ ...s, [key]: false }));
    }
  };

  const saveNote = async (note: PricingNote) => {
    const key = `note-${note.id}`;
    setSaving((s) => ({ ...s, [key]: true }));
    setStatus((s) => ({ ...s, [key]: "" }));
    try {
      const res = await fetch(`/api/admin/pricing/notes/${note.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: note.text }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus((s) => ({ ...s, [key]: "Saved." }));
    } catch {
      setStatus((s) => ({ ...s, [key]: "Save failed." }));
    } finally {
      setSaving((s) => ({ ...s, [key]: false }));
    }
  };

  const updateTierField = (id: number, field: keyof PricingTier, value: string | number | string[]) => {
    setTiers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const updateFeature = (tierId: number, index: number, value: string) => {
    setTiers((prev) =>
      prev.map((t) =>
        t.id === tierId
          ? { ...t, features: t.features.map((f, i) => (i === index ? value : f)) }
          : t
      )
    );
  };

  const addFeature = (tierId: number) => {
    setTiers((prev) =>
      prev.map((t) =>
        t.id === tierId ? { ...t, features: [...t.features, ""] } : t
      )
    );
  };

  const removeFeature = (tierId: number, index: number) => {
    setTiers((prev) =>
      prev.map((t) =>
        t.id === tierId
          ? { ...t, features: t.features.filter((_, i) => i !== index) }
          : t
      )
    );
  };

  const updateNote = (id: number, text: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, text } : n)));
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-10">
        <p className="font-body text-text-secondary text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <h1 className="font-heading text-navy text-2xl sm:text-3xl font-bold mb-8">
        Pricing
      </h1>

      {status.global && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6" role="alert">
          <p className="font-body text-red-700 text-sm">{status.global}</p>
        </div>
      )}

      {/* Tiers */}
      <div className="space-y-8 mb-10">
        {tiers.map((tier) => {
          const key = `tier-${tier.id}`;
          return (
            <div key={tier.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-heading text-navy text-lg font-bold mb-5">{tier.name} Tier</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div>
                  <label
                    htmlFor={`tier-name-${tier.id}`}
                    className="block font-body text-sm font-medium text-text-primary mb-1.5"
                  >
                    Tier Name
                  </label>
                  <input
                    id={`tier-name-${tier.id}`}
                    type="text"
                    value={tier.name}
                    onChange={(e) => updateTierField(tier.id, "name", e.target.value)}
                    className="w-full font-body text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`tier-price-${tier.id}`}
                    className="block font-body text-sm font-medium text-text-primary mb-1.5"
                  >
                    Monthly Price ($)
                  </label>
                  <input
                    id={`tier-price-${tier.id}`}
                    type="number"
                    min="0"
                    value={tier.price}
                    onChange={(e) => updateTierField(tier.id, "price", Number(e.target.value))}
                    className="w-full font-body text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mb-5">
                <p className="font-body text-sm font-medium text-text-primary mb-2">Features</p>
                <div className="space-y-2">
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(tier.id, i, e.target.value)}
                        aria-label={`Feature ${i + 1}`}
                        className="flex-1 font-body text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(tier.id, i)}
                        className="flex-shrink-0 text-red-400 hover:text-red-600 p-1 rounded transition-colors"
                        aria-label={`Remove feature ${i + 1}`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addFeature(tier.id)}
                  className="mt-2 font-body text-xs text-gold hover:text-navy transition-colors flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add feature
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => saveTier(tier)}
                  disabled={saving[key]}
                  className="font-body font-semibold text-navy bg-gold hover:bg-gold-light disabled:opacity-60 px-5 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  {saving[key] ? "Saving..." : "Save Changes"}
                </button>
                {status[key] && (
                  <p
                    className={`font-body text-xs ${
                      status[key] === "Saved." ? "text-green-600" : "text-red-600"
                    }`}
                    role="status"
                  >
                    {status[key]}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Notes */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-heading text-navy text-lg font-bold mb-5">Pricing Notes</h2>
        <div className="space-y-4">
          {notes.map((note) => {
            const key = `note-${note.id}`;
            return (
              <div key={note.id}>
                <div className="flex items-start gap-3">
                  <span className="font-body text-gold font-bold text-sm mt-2 flex-shrink-0">{note.sort_order}.</span>
                  <div className="flex-1">
                    <textarea
                      value={note.text}
                      onChange={(e) => updateNote(note.id, e.target.value)}
                      rows={2}
                      aria-label={`Note ${note.sort_order}`}
                      className="w-full font-body text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
                    />
                    <div className="flex items-center gap-3 mt-1.5">
                      <button
                        type="button"
                        onClick={() => saveNote(note)}
                        disabled={saving[key]}
                        className="font-body text-xs font-semibold text-navy bg-gold hover:bg-gold-light disabled:opacity-60 px-3 py-1.5 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-gold"
                      >
                        {saving[key] ? "Saving..." : "Save"}
                      </button>
                      {status[key] && (
                        <p
                          className={`font-body text-xs ${
                            status[key] === "Saved." ? "text-green-600" : "text-red-600"
                          }`}
                          role="status"
                        >
                          {status[key]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
