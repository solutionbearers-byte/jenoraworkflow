"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Role = {
  id: string;
  name: string;
};

export default function UserCreationPage() {
  const params = useParams();
  const orgId = params.orgId as string;
  const [roles, setRoles] = useState<Role[]>([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadRoles() {
      const response = await fetch(`/api/organizations/${orgId}/roles`);
      const data = await response.json();
      if (response.ok) {
        setRoles(data.roles ?? []);
      } else {
        setError(data.error || "Unable to load roles.");
      }
      setLoading(false);
    }
    loadRoles();
  }, [orgId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    const res = await fetch(`/api/organizations/${orgId}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: fullName, email, role_id: roleId, password }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error || "Unable to create user.");
      return;
    }

    setSuccess("User created successfully.");
    setFullName("");
    setEmail("");
    setPassword("");
    setRoleId("");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">Create user for organization</p>
              <h1 className="text-3xl font-semibold text-white">New user for org {orgId}</h1>
              <p className="mt-2 text-slate-300">Assign a role and set a password for this org member.</p>
            </div>
            <Link href="/superadmin" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
              Back to Super admin
            </Link>
          </div>

          <div className="mt-8 space-y-5">
            {loading ? (
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 text-slate-300">Loading roles…</div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                {error && <div className="rounded-2xl border border-red-600/20 bg-red-600/10 px-4 py-3 text-sm text-red-100">{error}</div>}
                {success && <div className="rounded-2xl border border-emerald-600/20 bg-emerald-600/10 px-4 py-3 text-sm text-emerald-100">{success}</div>}

                <label className="block text-sm text-slate-200">
                  Full name
                  <input
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-white/40"
                  />
                </label>

                <label className="block text-sm text-slate-200">
                  Email address
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-white/40"
                  />
                </label>

                <label className="block text-sm text-slate-200">
                  Role
                  <select
                    value={roleId}
                    onChange={e => setRoleId(e.target.value)}
                    required
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-white/40"
                  >
                    <option value="">Select a role</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm text-slate-200">
                  Password
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-white/40"
                  />
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Creating user..." : "Create user"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
