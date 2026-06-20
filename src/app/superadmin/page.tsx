import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function fetchSuperAdminData() {
  const [requestsResponse, organizationsResponse] = await Promise.all([
    supabaseAdmin
      .from("org_requests")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("organizations")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  return {
    pendingRequests: requestsResponse.data ?? [],
    organizations: organizationsResponse.data ?? [],
    requestsError: requestsResponse.error,
    organizationsError: organizationsResponse.error,
  };
}

export default async function SuperadminPage() {
  const { pendingRequests, organizations, requestsError, organizationsError } = await fetchSuperAdminData();

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20">
          <p className="text-sm text-slate-400">Super admin home</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Pending org requests and active organizations</h1>
          <p className="mt-2 text-slate-300">Review inbound org requests, see active orgs, and open management actions.</p>
        </header>

        {(requestsError || organizationsError) && (
          <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6 text-amber-100">
            <p className="font-semibold">Data warning</p>
            <p>{requestsError?.message ?? organizationsError?.message ?? "Unable to load some resources."}</p>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Pending org requests</h2>
                <p className="mt-2 text-slate-400">New organizations waiting for review.</p>
              </div>
              <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-slate-200">{pendingRequests.length}</span>
            </div>

            <div className="mt-6 space-y-4">
              {pendingRequests.length === 0 ? (
                <p className="text-slate-400">No pending organization requests.</p>
              ) : (
                pendingRequests.map(request => (
                  <div key={request.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-lg font-semibold text-white">{request.org_name || "Untitled request"}</p>
                        <p className="text-sm text-slate-400">{request.contact_name} · {request.contact_email}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">{request.status ?? "pending"}</span>
                        <Link
                          href={`/superadmin/organizations/new?requestId=${request.id}`}
                          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                        >
                          Approve org
                        </Link>
                      </div>
                    </div>
                    {request.message ? (
                      <p className="mt-4 text-slate-300">{request.message}</p>
                    ) : null}
                    <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-500">Received {request.created_at ?? "n/a"}</p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Existing organizations</h2>
                <p className="mt-2 text-slate-400">Active organizations in the system.</p>
              </div>
              <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-slate-200">{organizations.length}</span>
            </div>

            <div className="mt-6 space-y-4">
              {organizations.length === 0 ? (
                <p className="text-slate-400">No organizations found yet.</p>
              ) : (
                organizations.map(org => {
                  const name = org.name || org.org_name || "Organization";
                  return (
                    <div key={org.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-lg font-semibold text-white">{name}</p>
                          <p className="text-sm text-slate-400">{org.contact_email ?? org.email ?? "No contact email"}</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <Link
                            href={`/superadmin/structure/${org.id}`}
                            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                          >
                            Structure
                          </Link>
                          <Link
                            href={`/superadmin/users/${org.id}`}
                            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                          >
                            Users
                          </Link>
                          <Link
                            href={`/superadmin/org/${org.id}`}
                            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
