"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StartupImage from "@/components/StartupImage";
import { store } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import { analyzeStartup } from "@/lib/ai";
import type { Startup } from "@/lib/types";

export default function StartupsPage() {
  const [startups, setStartups] = useState<Startup[]>([]);

  useEffect(() => {
    setStartups(store.startups.getApproved());
  }, []);

  const withScores = startups.map((s) => ({ ...s, report: analyzeStartup(s) }));

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold text-white">Explore Startups</h1>
        <p className="mb-8 text-slate-400">
          AI-analyzed. Click any card for full details, risk assessment, and chatbot.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {withScores.length === 0 ? (
            <p className="col-span-full rounded-lg border border-slate-700 bg-slate-800/50 p-8 text-center text-slate-400">
              No startups listed yet. Register your startup to appear here.
            </p>
          ) : (
            withScores.map((s) => (
              <Link
                key={s.id}
                href={`/startups/${s.id}`}
                className="group rounded-xl border border-slate-700 bg-slate-800/50 p-5 transition hover:border-emerald-600/50 hover:bg-slate-800/70"
              >
                <div className="mb-3 flex items-center gap-3">
                  <StartupImage name={s.name} size={56} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white group-hover:text-emerald-400">{s.name}</h3>
                    {s.report.riskFree && (
                      <span className="inline-block rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
                        Risk-Free
                      </span>
                    )}
                  </div>
                </div>
                <p className="mb-3 text-sm text-slate-400">{s.industry}</p>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="text-emerald-400">Score: {s.report.score}</span>
                  <span className="text-slate-500">Risk: {s.report.riskScore}</span>
                </div>
                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-slate-500">Valuation</span>
                  <span className="text-emerald-400">{formatINR(s.valuation)}</span>
                </div>
                <div className="mt-1 flex justify-between text-sm">
                  <span className="text-slate-500">Seeking</span>
                  <span>{formatINR(s.investmentRequired)}</span>
                </div>
              </Link>
            ))
          )}
        </div>
        <p className="mt-12 text-center text-xs text-slate-500">
          SEBI-aware platform. See{" "}
          <Link href="/legal" className="text-emerald-500 hover:underline">
            Legal & Risk Disclosure
          </Link>{" "}
          before investing.
        </p>
      </div>
      <Footer />
    </div>
  );
}
