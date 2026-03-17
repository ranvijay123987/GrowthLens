import Link from "next/link";

export default function PrivacyPage() {
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
        <h1 className="mb-6 text-3xl font-bold text-white">Privacy Policy</h1>
        <div className="space-y-6 text-slate-300">
          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">1. Information We Collect</h2>
            <p>
              We collect: name, email, role (investor/startup/bank/admin), and data you provide
              (startup metrics, investment amounts). Data is stored locally for this demo; in
              production, we use secure servers compliant with applicable data protection laws.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">2. How We Use It</h2>
            <p>
              To operate the platform, display startup listings, facilitate investments and loans,
              and improve our AI analysis. We do not sell your personal data.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">3. Data Security</h2>
            <p>
              We implement reasonable security measures. Passwords should be strong; we recommend
              two-factor authentication where available.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-semibold text-white">4. Your Rights</h2>
            <p>
              You may request access, correction, or deletion of your data. Contact us to exercise
              these rights.
            </p>
          </section>
          <p className="text-sm text-slate-500">Last updated: March 2025</p>
        </div>
      </main>
    </div>
  );
}
