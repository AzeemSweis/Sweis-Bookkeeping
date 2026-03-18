"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface SiteConfig {
  bio_heading: string;
  bio_text_1: string;
  bio_text_2: string;
  bookkeeping_heading: string;
  bookkeeping_text: string;
  bookkeeping_services: string;
  bookkeeping_footnote: string;
  headshot_url: string;
}

const KEYS: (keyof SiteConfig)[] = [
  "bio_heading",
  "bio_text_1",
  "bio_text_2",
  "bookkeeping_heading",
  "bookkeeping_text",
  "bookkeeping_services",
  "bookkeeping_footnote",
  "headshot_url",
];

const LABELS: Record<keyof SiteConfig, string> = {
  bio_heading: "Bio Heading",
  bio_text_1: "Bio Paragraph 1",
  bio_text_2: "Bio Paragraph 2",
  bookkeeping_heading: "Bookkeeping Section Heading",
  bookkeeping_text: "Bookkeeping Intro Text",
  bookkeeping_services: "Services List (JSON array)",
  bookkeeping_footnote: "Footnote",
  headshot_url: "Headshot URL",
};

const MULTILINE: (keyof SiteConfig)[] = [
  "bio_text_1", "bio_text_2", "bookkeeping_heading", "bookkeeping_text", "bookkeeping_services"
];

async function saveKey(key: string, value: string): Promise<void> {
  const res = await fetch("/api/admin/site-config", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? "Failed to save");
  }
}

export default function BioPage() {
  const [config, setConfig] = useState<SiteConfig>({
    bio_heading: "",
    bio_text_1: "",
    bio_text_2: "",
    bookkeeping_heading: "",
    bookkeeping_text: "",
    bookkeeping_services: "",
    bookkeeping_footnote: "",
    headshot_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [fieldStatus, setFieldStatus] = useState<Record<string, string>>({});
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/site-config");
      if (!res.ok) throw new Error("Failed");
      const data: Record<string, string> = await res.json();
      setConfig((prev) => {
        const next = { ...prev };
        for (const key of KEYS) {
          if (data[key] !== undefined) next[key] = data[key];
        }
        return next;
      });
    } catch {
      setFieldStatus((s) => ({ ...s, global: "Failed to load content." }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (key: keyof SiteConfig) => {
    setSaving((s) => ({ ...s, [key]: true }));
    setFieldStatus((s) => ({ ...s, [key]: "" }));
    try {
      await saveKey(key, config[key]);
      setFieldStatus((s) => ({ ...s, [key]: "Saved." }));
    } catch {
      setFieldStatus((s) => ({ ...s, [key]: "Save failed." }));
    } finally {
      setSaving((s) => ({ ...s, [key]: false }));
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      setConfig((prev) => ({ ...prev, headshot_url: url }));
      await saveKey("headshot_url", url);
      setUploadStatus("Headshot updated.");
    } catch {
      setUploadStatus("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
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
    <div className="p-6 lg:p-10 max-w-3xl">
      <h1 className="font-heading text-navy text-2xl sm:text-3xl font-bold mb-8">
        Bio &amp; About Content
      </h1>

      {/* Headshot uploader */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="font-heading text-navy text-lg font-bold mb-4">Headshot</h2>
        <div className="flex items-center gap-6">
          {config.headshot_url && (
            <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-gold/30 flex-shrink-0">
              <Image
                src={config.headshot_url}
                alt="Current headshot"
                fill
                className="object-cover object-top"
                sizes="96px"
              />
            </div>
          )}
          <div>
            <label
              htmlFor="headshot-upload"
              className="block font-body text-sm font-medium text-text-primary mb-1.5"
            >
              Upload new headshot
            </label>
            <input
              id="headshot-upload"
              type="file"
              ref={fileRef}
              accept="image/jpeg,image/png,image/webp"
              onChange={handleUpload}
              disabled={uploading}
              className="font-body text-sm text-text-secondary file:mr-3 file:font-semibold file:text-navy file:bg-gold/20 file:hover:bg-gold/30 file:border-0 file:rounded file:px-3 file:py-1.5 file:text-xs file:cursor-pointer"
            />
            {uploadStatus && (
              <p
                className={`font-body text-xs mt-2 ${
                  uploadStatus.includes("failed") ? "text-red-600" : "text-green-600"
                }`}
                role="status"
              >
                {uploadStatus}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Text fields */}
      <div className="space-y-6">
        {KEYS.filter((k) => k !== "headshot_url").map((key) => {
          const isMulti = MULTILINE.includes(key);
          return (
            <div key={key} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <label
                htmlFor={`bio-${key}`}
                className="block font-body text-sm font-medium text-text-primary mb-1.5"
              >
                {LABELS[key]}
              </label>
              {isMulti ? (
                <textarea
                  id={`bio-${key}`}
                  value={config[key]}
                  onChange={(e) => setConfig((prev) => ({ ...prev, [key]: e.target.value }))}
                  rows={key === "bookkeeping_services" ? 8 : 4}
                  className="w-full font-body text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
                />
              ) : (
                <input
                  id={`bio-${key}`}
                  type="text"
                  value={config[key]}
                  onChange={(e) => setConfig((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="w-full font-body text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              )}
              {key === "bookkeeping_services" && (
                <p className="font-body text-text-secondary text-xs mt-1">
                  Must be a valid JSON array, e.g. [&quot;Service one&quot;, &quot;Service two&quot;]
                </p>
              )}
              <div className="flex items-center gap-3 mt-3">
                <button
                  type="button"
                  onClick={() => handleSave(key)}
                  disabled={saving[key]}
                  className="font-body font-semibold text-navy bg-gold hover:bg-gold-light disabled:opacity-60 px-4 py-1.5 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  {saving[key] ? "Saving..." : "Save"}
                </button>
                {fieldStatus[key] && (
                  <p
                    className={`font-body text-xs ${
                      fieldStatus[key] === "Saved." ? "text-green-600" : "text-red-600"
                    }`}
                    role="status"
                  >
                    {fieldStatus[key]}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
