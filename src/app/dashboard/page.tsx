"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const contentByLevel: Record<number, string[]> = {
  1: [
    "Executive overview",
    "Budget approvals",
    "Technical planning",
    "Media coordination",
    "Officer activity summary",
  ],
  2: ["Budget approvals", "Expense reports", "Org-level finance summaries"],
  3: ["Technical plans", "Project status", "Deployment schedule"],
  4: ["Media calendar", "Campaign updates", "Social assets review"],
  5: ["Officer tasks", "Team checklists", "Event coordination"],
};

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const [visibleContent, setVisibleContent] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      const roles = contentByLevel[user.hierarchy_level] ?? contentByLevel[5];
      setVisibleContent(roles);
    }
  }, [user]);

  const welcomeLabel = useMemo(() => {
    if (!user) return "Dashboard";
    return user.is_super_admin ? "Super Admin Dashboard" : "Organization Dashboard";
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-lg text-slate-300">Loading your dashboard…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-slate-400">Welcome back</p>
              <h1 className="text-3xl font-semibold tracking-tight text-white">{welcomeLabel}</h1>
              <p className="mt-2 text-slate-300">{user ? `Signed in as ${user.full_name} (${user.role_name})` : "Sign in to view your organization content."}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {user?.is_super_admin && (
                <a href="/superadmin" className="rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white">
                  Super Admin panel
                </a>
              )}
              <button
                onClick={logout}
                className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white transition hover:border-white/30 hover:bg-white/10"
              >
                Sign out
              </button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
              <h2 className="text-xl font-semibold text-white">Your organization</h2>
              <div className="mt-4 space-y-3 text-slate-300">
                <p><span className="font-medium text-white">Organization ID:</span> {user?.org_id ?? "—"}</p>
                <p><span className="font-medium text-white">Email:</span> {user?.email ?? "—"}</p>
                <p><span className="font-medium text-white">Hierarchy level:</span> {user?.hierarchy_level ?? "—"}</p>
                <p><span className="font-medium text-white">Super admin:</span> {user?.is_super_admin ? "Yes" : "No"}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
              <h2 className="text-xl font-semibold text-white">Level-based content</h2>
              <p className="mt-2 text-slate-400">Content is filtered by your approval level and role.</p>
              <ul className="mt-4 space-y-3">
                {visibleContent.map(item => (
                  <li key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
