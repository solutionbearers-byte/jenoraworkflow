"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [orgName, setOrgName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/org-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          org_name: orgName,
          contact_name: contactName,
          contact_email: contactEmail,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        setSuccess("Your request has been submitted. You will be contacted shortly.");
        setOrgName("");
        setContactName("");
        setContactEmail("");
        setMessage("");
      }
    } catch {
      setError("Unable to submit your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl shadow-black/20">
        <div className="mb-8 space-y-3">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Organization request</p>
          <h1 className="text-3xl font-semibold text-white">Register your organization</h1>
          <p className="text-slate-400">Share your organization details and a point of contact so we can reach out with next steps.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <div className="rounded-2xl border border-red-600/20 bg-red-600/10 px-4 py-3 text-sm text-red-100">{error}</div>}
          {success && <div className="rounded-2xl border border-emerald-600/20 bg-emerald-600/10 px-4 py-3 text-sm text-emerald-100">{success}</div>}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm text-slate-200">
              Organization name
              <input
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-white/40"
              />
            </label>
            <label className="block text-sm text-slate-200">
              Contact name
              <input
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-white/40"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm text-slate-200">
              Contact email
              <input
                type="email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-white/40"
              />
            </label>
            <label className="block text-sm text-slate-200">
              Message (optional)
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-white/40"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit request"}
          </button>
        </form>
      </div>
    </div>
  );
}
