import Link from "next/link";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <span className="text-xl font-bold text-emerald-400">GrowthLens AI</span>
          <div className="flex items-center gap-4">
            <Link href="/legal" className="rounded-lg px-4 py-2 text-slate-400 hover:text-white">
              Legal
            </Link>
            <Link href="/startups" className="rounded-lg px-4 py-2 text-slate-300 hover:text-white">
              Startups
            </Link>
            <Link href="/login" className="rounded-lg px-4 py-2 text-slate-300 hover:text-white">
              Login
            </Link>
            <Link
              href="/signup?role=investor"
              className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-500"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-20">
        <section className="text-center">
          <p className="mb-2 text-emerald-400">For Smart Investors</p>
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-white md:text-6xl">
            Invest with Confidence. AI-Powered Risk Analysis.
          </h1>
          <p className="mb-12 text-xl text-slate-400">
            Authentic startup data. AI tells you if it&apos;s risk-free. Interactive charts.
            Full chatbot support. All in ₹.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/signup?role=investor"
              className="rounded-lg bg-emerald-600 px-8 py-4 font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500"
            >
              Start Investing
            </Link>
            <Link
              href="/startups"
              className="rounded-lg border border-slate-600 bg-slate-800/50 px-8 py-4 font-semibold text-white hover:bg-slate-700/50"
            >
              Browse Startups
            </Link>
          </div>
        </section>

        <section className="mt-32 grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Risk-Free AI Check",
              desc: "AI analyzes every startup and tells you if it's risk-free. Real-time risk scores and factors.",
              icon: "🛡️",
            },
            {
              title: "Full AI Chatbot",
              desc: "Ask anything — profitability, risks, growth. Conversational AI with context and quick replies.",
              icon: "🤖",
            },
            {
              title: "Interactive Graphs",
              desc: "Revenue trends, burn vs revenue, portfolio allocation. Click, zoom, explore your data.",
              icon: "📊",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 transition hover:border-emerald-600/50"
            >
              <div className="mb-3 text-3xl">{f.icon}</div>
              <h3 className="mb-2 font-semibold text-white">{f.title}</h3>
              <p className="text-slate-400">{f.desc}</p>
            </div>
          ))}
        </section>

        <section className="mt-24">
          <h2 className="mb-6 text-center text-2xl font-semibold text-white">
            Where to Find Everything
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
              <h3 className="mb-2 font-semibold text-emerald-400">Investor</h3>
              <p className="mb-4 text-sm text-slate-400">
                Browse startups, AI analysis, invest.
              </p>
              <Link
                href="/signup?role=investor"
                className="inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
              >
                Sign Up as Investor
              </Link>
              <p className="mt-2 text-xs text-slate-500">→ Dashboard → Startups</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
              <h3 className="mb-2 font-semibold text-emerald-400">Startup Listing</h3>
              <p className="mb-4 text-sm text-slate-400">
                Register your startup, add metrics.
              </p>
              <Link
                href="/signup?role=startup"
                className="inline-block rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600"
              >
                Sign Up as Startup
              </Link>
              <p className="mt-2 text-xs text-slate-500">→ Dashboard → Register Startup</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
              <h3 className="mb-2 font-semibold text-emerald-400">Bank</h3>
              <p className="mb-4 text-sm text-slate-400">
                View and approve loan requests.
              </p>
              <Link
                href="/signup?role=bank"
                className="inline-block rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600"
              >
                Sign Up as Bank
              </Link>
              <p className="mt-2 text-xs text-slate-500">→ Loan Requests</p>
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-xl border border-slate-700 bg-slate-800/30 p-6">
          <h2 className="mb-2 font-semibold text-white">Legal & Authentication</h2>
          <p className="mb-4 text-sm text-slate-400">
            SEBI disclosures, Terms of Use, Privacy Policy, Risk Disclosure.
          </p>
          <Link
            href="/legal"
            className="inline-flex items-center text-emerald-400 hover:underline"
          >
            View all legal documents →
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
