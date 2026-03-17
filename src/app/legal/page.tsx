import Link from "next/link";

export default function LegalPage() {
  const docs = [
    { href: "/legal/sebi", title: "SEBI & Regulatory Disclosures" },
    { href: "/legal/terms", title: "Terms of Use" },
    { href: "/legal/privacy", title: "Privacy Policy" },
    { href: "/legal/risk", title: "Risk Disclosure" },
  ];
  return (
    <div className="min-h-screen bg-slate-950">
      <nav className="border-b border-slate-800 bg-slate-950/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-bold text-emerald-400">
            GrowthLens AI
          </Link>
          <Link href="/" className="text-sm text-slate-400 hover:text-white">
            ← Home
          </Link>
        </div>
      </nav>
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-6 text-3xl font-bold text-white">Legal Documents</h1>
        <p className="mb-8 text-slate-400">
          Read our legal and regulatory documents for authentication and compliance.
        </p>
        <div className="space-y-4">
          {docs.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              className="block rounded-lg border border-slate-700 bg-slate-800/50 px-5 py-4 text-white transition hover:border-emerald-600/50"
            >
              {d.title}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
