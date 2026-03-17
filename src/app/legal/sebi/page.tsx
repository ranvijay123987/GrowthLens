import Link from "next/link";

export default function SEBIPage() {
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
        <h1 className="mb-6 text-3xl font-bold text-white">SEBI & Regulatory Disclosures</h1>
        <div className="space-y-6 text-slate-300">
          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">SEBI Compliance</h2>
            <p>
              GrowthLens AI operates as an information and technology platform connecting investors
              with startups. We are not registered with the Securities and Exchange Board of India
              (SEBI) as a stock broker, investment adviser, or Alternative Investment Fund (AIF).
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">Disclaimer</h2>
            <ul className="list-inside list-disc space-y-2">
              <li>
                The platform does not provide investment advice. AI analysis is for informational
                purposes only.
              </li>
              <li>
                Startups listed may or may not be SEBI-compliant. Investors must conduct their own
                due diligence.
              </li>
              <li>
                Investments in unlisted securities carry high risk. Past performance does not
                guarantee future returns.
              </li>
            </ul>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">SEBI Regulations Awareness</h2>
            <p>
              Users are advised to familiarise themselves with SEBI regulations including but not
              limited to: SEBI (Alternative Investment Funds) Regulations, 2012; SEBI (Prohibition
              of Insider Trading) Regulations; and applicable startup listing norms. Consult a
              SEBI-registered investment adviser before making investment decisions.
            </p>
          </section>
          <p className="text-sm text-slate-500">Last updated: March 2025</p>
        </div>
      </main>
    </div>
  );
}
