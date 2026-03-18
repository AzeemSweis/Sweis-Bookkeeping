"use client";

import { useState, useEffect, useCallback } from "react";

interface Submission {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
}

function formatDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/submissions");
      if (!res.ok) throw new Error("Failed to load");
      setSubmissions(await res.json());
    } catch {
      setError("Failed to load submissions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-navy text-2xl sm:text-3xl font-bold">
          Submissions
        </h1>
        <button
          type="button"
          onClick={load}
          className="font-body text-sm text-text-secondary hover:text-navy transition-colors flex items-center gap-1.5"
          aria-label="Refresh submissions"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6" role="alert">
          <p className="font-body text-red-700 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <p className="font-body text-text-secondary text-sm">Loading...</p>
      ) : submissions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
          <p className="font-body text-text-secondary text-sm">No submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="font-body text-text-secondary text-xs mb-2">
            {submissions.length} submission{submissions.length !== 1 ? "s" : ""} total
          </p>
          {submissions.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setExpanded((prev) => (prev === s.id ? null : s.id))}
                className="w-full text-left p-5 hover:bg-gray-50 transition-colors"
                aria-expanded={expanded === s.id}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-0.5">
                      <p className="font-body text-navy font-semibold text-sm">
                        {s.name}
                      </p>
                      {s.phone && (
                        <span className="font-body text-text-secondary text-xs">
                          {s.phone}
                        </span>
                      )}
                    </div>
                    <p className="font-body text-text-secondary text-xs">{s.email}</p>
                    {expanded !== s.id && (
                      <p className="font-body text-text-primary text-sm mt-1.5 line-clamp-1 text-gray-600">
                        {s.message}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-3">
                    <span className="font-body text-text-secondary text-xs whitespace-nowrap">
                      {formatDate(s.created_at)}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${expanded === s.id ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>

              {expanded === s.id && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                  <p className="font-body text-sm font-medium text-text-secondary mb-1">
                    Message
                  </p>
                  <p className="font-body text-text-primary text-sm whitespace-pre-wrap">
                    {s.message}
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <a
                      href={`mailto:${s.email}`}
                      className="font-body text-xs font-semibold text-navy bg-gold/20 hover:bg-gold/30 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Reply via Email
                    </a>
                    {s.phone && (
                      <a
                        href={`tel:${s.phone.replace(/\D/g, "")}`}
                        className="font-body text-xs text-text-secondary hover:text-navy transition-colors"
                      >
                        Call {s.phone}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
