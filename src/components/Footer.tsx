"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h4 className="mb-3 font-semibold text-white">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/startups" className="hover:text-emerald-400">
                  Browse Startups
                </Link>
              </li>
              <li>
                <Link href="/signup?role=investor" className="hover:text-emerald-400">
                  Join as Investor
                </Link>
              </li>
              <li>
                <Link href="/signup?role=startup" className="hover:text-emerald-400">
                  List Your Startup
                </Link>
              </li>
              <li>
                <Link href="/signup?role=bank" className="hover:text-emerald-400">
                  Bank Portal
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-white">Where to Go</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <strong className="text-slate-300">Investors:</strong>{" "}
                <Link href="/signup?role=investor" className="text-emerald-400 hover:underline">
                  Sign up
                </Link>{" "}
                → Dashboard → Browse Startups
              </li>
              <li>
                <strong className="text-slate-300">Startups:</strong>{" "}
                <Link href="/signup?role=startup" className="text-emerald-400 hover:underline">
                  Sign up
                </Link>{" "}
                → Dashboard → Register Startup
              </li>
              <li>
                <strong className="text-slate-300">Banks:</strong>{" "}
                <Link href="/signup?role=bank" className="text-emerald-400 hover:underline">
                  Sign up
                </Link>{" "}
                → Loan Requests
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-white">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/legal/sebi" className="hover:text-emerald-400">
                  SEBI Disclosures
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="hover:text-emerald-400">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-emerald-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/risk" className="hover:text-emerald-400">
                  Risk Disclosure
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-white">GrowthLens AI</h4>
            <p className="text-sm text-slate-400">
              AI-powered startup investment platform. SEBI-aware. All amounts in ₹.
            </p>
            <Link href="/legal" className="mt-2 inline-block text-sm text-emerald-400 hover:underline">
              All Legal Documents →
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} GrowthLens AI. For authentication & compliance, see{" "}
          <Link href="/legal" className="text-emerald-400 hover:underline">
            Legal
          </Link>
          .
        </div>
      </div>
    </footer>
  );
}
