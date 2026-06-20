"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Role = {
  id: string;
  name: string;
  hierarchy_level: number;
  parent_role_id?: string | null;
};

function buildRoleTree(roles: Role[]) {
  const tree = new Map<string, Role & { children: Role[] }>();
  const roots: (Role & { children: Role[] })[] = [];

  roles.forEach(role => {
    tree.set(role.id, { ...role, children: [] });
  });

  tree.forEach(role => {
    if (role.parent_role_id && tree.has(role.parent_role_id)) {
      tree.get(role.parent_role_id)!.children.push(role);
    } else {
      roots.push(role);
    }
  });

  return roots;
}

function RoleNode({ role }: { role: Role & { children: Role[] } }) {
  return (
    <li className="space-y-3">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-white">{role.name}</p>
            <p className="text-sm text-slate-400">Level {role.hierarchy_level}</p>
          </div>
        </div>
      </div>
      {role.children.length > 0 && (
        <ul className="ml-6 border-l border-white/10 pl-4">
          {role.children.map(child => (
            <RoleNode key={child.id} role={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function StructureBuilderPage() {
  const params = useParams();
  const orgId = params.orgId as string;
  const [roles, setRoles] = useState<Role[]>([]);
  const [name, setName] = useState("");
  const [hierarchyLevel, setHierarchyLevel] = useState(1);
  const [parentRoleId, setParentRoleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadRoles() {
      setLoading(true);
      const res = await fetch(`/api/organizations/${orgId}/roles`);
      const data = await res.json();
      if (res.ok) {
        setRoles(data.roles ?? []);
      } else {
        setError(data.error || "Unable to load roles.");
      }
      setLoading(false);
    }
    loadRoles();
  }, [orgId]);

  const roleTree = useMemo(() => buildRoleTree(roles), [roles]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    const res = await fetch(`/api/organizations/${orgId}/roles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        hierarchy_level: hierarchyLevel,
        parent_role_id: parentRoleId,
      }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error || "Unable to add role.");
      return;
    }

    setRoles(prev => [...prev, data.role]);
    setName("");
    setHierarchyLevel(1);
    setParentRoleId(null);
    setSuccess("Role added successfully.");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">Org structure builder</p>
              <h1 className="text-3xl font-semibold text-white">Build roles for org {orgId}</h1>
              <p className="mt-2 text-slate-300">Add roles, assign hierarchy levels, and link parents as you build the org chain.</p>
            </div>
            <Link href="/superadmin" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
              Back to Super admin
            </Link>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
            <h2 className="text-xl font-semibold text-white">Add a new role</h2>
            <p className="mt-2 text-slate-400">Create role definitions and attach parent relationships.</p>
            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              {error && <div className="rounded-2xl border border-red-600/20 bg-red-600/10 px-4 py-3 text-sm text-red-100">{error}</div>}
              {success && <div className="rounded-2xl border border-emerald-600/20 bg-emerald-600/10 px-4 py-3 text-sm text-emerald-100">{success}</div>}

              <label className="block text-sm text-slate-200">
                Role name
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-white/40"
                />
              </label>

              <label className="block text-sm text-slate-200">
                Hierarchy level
                <input
                  type="number"
                  min="1"
                  value={hierarchyLevel}
                  onChange={e => setHierarchyLevel(Number(e.target.value))}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-white/40"
                />
              </label>

              <label className="block text-sm text-slate-200">
                Parent role
                <select
                  value={parentRoleId ?? ""}
                  onChange={e => setParentRoleId(e.target.value || null)}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-white/40"
                >
                  <option value="">Top-level role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Adding role..." : "Add role"}
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
            <h2 className="text-xl font-semibold text-white">Role chain preview</h2>
            <p className="mt-2 text-slate-400">Visualize the role hierarchy as it is built.</p>
            {loading ? (
              <div className="mt-6 text-slate-300">Loading roles…</div>
            ) : roles.length === 0 ? (
              <p className="mt-6 text-slate-400">No roles created yet.</p>
            ) : (
              <ul className="mt-6 space-y-4">
                {roleTree.map(role => (
                  <RoleNode key={role.id} role={role} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
