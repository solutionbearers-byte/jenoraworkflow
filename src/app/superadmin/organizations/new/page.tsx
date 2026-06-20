"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

export default function NewOrganizationPage() {
  const router = useRouter();

  return (
    <Suspense fallback={<p className="text-slate-300">Loading...</p>}>
      <NewOrganizationForm router={router} />
    </Suspense>
  );
}

function NewOrganizationForm({ router }: { router: ReturnType<typeof useRouter> }) {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId") ?? "";

  const [request, setRequest] = useState<any>(null);
  const [loadingRequest, setLoadingRequest] = useState(Boolean(requestId));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [miscBuffer, setMiscBuffer] = useState("10");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!requestId) return;

    setLoadingRequest(true);
    fetch(`/api/org-requests/${requestId}`)
      .then(res => res.json())
      .then(data => {
        if (data.request) {
          setRequest(data.request);
          setName(data.request.org_name || "");
          setSlug(normalizeSlug(data.request.org_name || ""));
        } else {
          setError(data.error || "Unable to load the org request.");
        }
      })
      .catch(() => setError("Unable to load the org request."))
      .finally(() => setLoadingRequest(false));
  }, [requestId]);

  const suggestSlug = useMemo(() => normalizeSlug(name || request?.org_name || ""), [name, request]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    const response = await fetch("/api/organizations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        request_id: requestId,
        name,
        slug: slug || suggestSlug,
        misc_buffer_pct: Number(miscBuffer),
      }),
    });

    const data = await response.json();
    setSubmitting(false);

    if (!response.ok) {
      setError(data.error || "Unable to create organization.");
      return;
    }

    setSuccess("Organization created successfully.");
    setTimeout(() => router.push("/superadmin"), 1800);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">Approve org request</p>
              <h1 className="text-3xl font-semibold text-white">Create new organization</h1>
              <p className="mt-2 text-slate-300">Complete official org details and approve the request.</p>
            </div>
            <Link href="/superadmin" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
              Back to Super admin
            </Link>
          </div>

          {loadingRequest ? (
            <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/80 p-8 text-center text-slate-300">Loading request...</div>
          ) : (
            <div className="mt-8 space-y-6">
              {request ? (
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Request details</p>
                  <p className="mt-3 text-lg font-semibold text-white">{request.org_name}</p>
                  <p className="text-slate-400">{request.contact_name} · {request.contact_email}</p>
                  {request.message ? <p className="mt-4 text-slate-300">{request.message}</p> : null}
                </div>
              ) : null}

              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && <div className="rounded-2xl border border-red-600/20 bg-red-600/10 px-4 py-3 text-sm text-red-100">{error}</div>}
                {success && <div className="rounded-2xl border border-emerald-600/20 bg-emerald-600/10 px-4 py-3 text-sm text-emerald-100">{success}</div>}

                <label className="block text-sm text-slate-200">
                  Organization name
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-white/40"
                  />
                </label>

                <label className="block text-sm text-slate-200">
                  URL slug
                  <input
                    value={slug || suggestSlug}
                    onChange={e => setSlug(e.target.value)}
                    placeholder={suggestSlug}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-white/40"
                  />
                </label>

                <label className="block text-sm text-slate-200">
                  Misc buffer %
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={miscBuffer}
                    onChange={e => setMiscBuffer(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-white/40"
                  />
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Creating org..." : "Approve and create org"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
