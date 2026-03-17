import Link from "next/link";

export default function TermsPage() {
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
        <h1 className="mb-6 text-3xl font-bold text-white">Terms of Use</h1>
        <div className="space-y-6 text-slate-300">
          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">1. Acceptance</h2>
            <p>
              By using GrowthLens AI, you agree to these Terms of Use. If you do not agree, do not
              use the platform.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">2. Eligibility</h2>
            <p>
              You must be 18+ and legally able to enter into binding contracts. Investors must
              comply with applicable investment regulations in India (including SEBI norms).
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">3. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account. Notify us
              immediately of any unauthorised use.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">4. No Investment Advice</h2>
            <p>
              GrowthLens AI provides information and AI-generated analysis only. We do not provide
              investment, legal, or tax advice. Consult qualified professionals before investing.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">5. Platform Use</h2>
            <p>
              You agree not to misuse the platform, misrepresent data, or engage in fraudulent
              activity. Startups must provide accurate financial and business information.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">6. Limitation of Liability</h2>
            <p>
              GrowthLens AI and its affiliates are not liable for investment losses, data errors, or
              decisions made based on platform content.
            </p>
          </section>
          <p className="text-sm text-slate-500">Last updated: March 2025</p>
        </div>
      </main>
    </div>
  );
}
