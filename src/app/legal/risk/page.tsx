import Link from "next/link";

export default function RiskDisclosurePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <nav className="border-b border-slate-800 bg-slate-950/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-bold text-emerald-400">
            GrowthLens AI
          </Link>
          <Link href="/legal" className="text-sm text-slate-400 hover:text-white">
            ← Legal
          </Link>
        </div>
      </nav>
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-6 text-3xl font-bold text-white">Risk Disclosure Statement</h1>
        <div className="space-y-6 text-slate-300">
          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">Important Notice</h2>
            <p>
              Investing in startups and early-stage companies involves substantial risk. You may
              lose some or all of your invested capital. Read this disclosure carefully before
              investing.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">Key Risks</h2>
            <ul className="list-inside list-disc space-y-2">
              <li>Startups may fail; there is no guarantee of returns.</li>
              <li>Investments in unlisted securities are illiquid; you may not be able to exit.</li>
              <li>AI analysis is not a substitute for professional due diligence.</li>
              <li>Regulatory changes may affect investments.</li>
              <li>Valuations may be subjective and may not reflect market value.</li>
            </ul>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">SEBI & Regulatory Risk</h2>
            <p>
              This platform is not regulated by SEBI. Startups listed may not comply with all SEBI
              norms. Investors must ensure they are eligible under applicable regulations (e.g.
              angel investor criteria) before investing.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">Acknowledgment</h2>
            <p>
              By using this platform, you acknowledge that you have read and understood these
              risks. You invest at your own risk. Consult a SEBI-registered adviser for
              investment advice.
            </p>
          </section>
          <p className="text-sm text-slate-500">Last updated: March 2025</p>
        </div>
      </main>
    </div>
  );
}
