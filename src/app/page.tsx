import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
          <section className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              Workflow authorization made simple
            </div>
            <div className="space-y-5">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Jenoraworkflow brings org registration, team structure, and approval control into one place.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Start with a public org request page, then manage organizations, user roles, and filtered dashboard content from a single admin console.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                Register your organization
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5">
                Sign in
              </Link>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/10">
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-slate-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800">
                  <span className="text-xl">🧩</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Public org requests</h2>
                  <p className="text-sm text-slate-400">Allow prospective organizations to request access from a simple, public form.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800">
                  <span className="text-xl">📊</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">One dashboard</h2>
                  <p className="text-sm text-slate-400">A single dashboard that can show the right content for every role and hierarchy level.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800">
                  <span className="text-xl">🛠️</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Super admin tools</h2>
                  <p className="text-sm text-slate-400">Manage pending requests, existing organizations, and team structure from one panel.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
