"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      username: form.username,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid username or password.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-heading text-navy text-3xl font-bold tracking-widest mb-1">
            SWEIS
          </h1>
          <p className="font-body text-text-secondary text-sm">Admin Panel</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="font-heading text-navy text-xl font-bold mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="login-username"
                className="block font-body text-sm font-medium text-text-primary mb-1.5"
              >
                Username
              </label>
              <input
                id="login-username"
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                autoComplete="username"
                autoFocus
                className="w-full font-body text-sm border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block font-body text-sm font-medium text-text-primary mb-1.5"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="w-full font-body text-sm border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition"
              />
            </div>

            {error && (
              <div
                className="bg-red-50 border border-red-200 rounded-lg px-4 py-3"
                role="alert"
              >
                <p className="font-body text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-body font-semibold text-navy bg-gold hover:bg-gold-light disabled:opacity-60 disabled:cursor-not-allowed px-6 py-2.5 rounded-lg tracking-wider uppercase text-sm transition-all focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-4">
          <a
            href="/"
            className="font-body text-text-secondary text-xs hover:text-navy transition-colors"
          >
            Back to public site
          </a>
        </p>
      </div>
    </div>
  );
}
