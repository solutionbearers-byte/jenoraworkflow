import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";

type OrgPageProps = {
  params: {
    orgId: string;
  };
};

export const dynamic = "force-dynamic";

export default async function OrgDetailsPage({ params }: OrgPageProps) {
  const { data: organization, error } = await supabaseAdmin
    .from("organizations")
    .select("*")
    .eq("id", params.orgId)
    .single();

  if (error || !organization) {
    return (
      <main className="min-h-screen bg-slate-950 text-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <h1 className="text-3xl font-semibold text-white">Organization not found</h1>
          <p className="mt-4 text-slate-400">We could not find that organization. Please go back to the super admin home.</p>
          <Link href="/superadmin" className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
            Back to Super admin
          </Link>
        </div>
      </main>
    );
  }

  const title = organization.name || organization.org_name || "Organization";

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">Organization management</p>
              <h1 className="text-3xl font-semibold text-white">{title}</h1>
            </div>
            <Link href="/superadmin" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
              Back to Super admin
            </Link>
          </div>

          <div className="mt-8 space-y-4 text-slate-300">
            {Object.entries(organization).map(([key, value]) => (
              <div key={key} className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{key}</p>
                <p className="mt-2 text-sm text-slate-100">{String(value ?? "—")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
