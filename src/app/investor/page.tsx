"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { store } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import { analyzeStartup } from "@/lib/ai";
import { PortfolioChart } from "@/components/Charts";
import StartupImage from "@/components/StartupImage";
import DashboardAI from "@/components/DashboardAI";
import type { Startup, Investment } from "@/lib/types";

export default function InvestorDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);

  useEffect(() => {
    if (!user || user.role !== "investor") {
      router.push("/login");
      return;
    }
    setStartups(store.startups.getApproved());
    setInvestments(store.investments.byInvestor(user.id));
  }, [user, router]);

  if (!user) return null;

  const totalInvested = investments.reduce((s, i) => s + i.amount, 0);
  const portfolioData = investments.map((inv) => {
    const s = store.startups.get(inv.startupId);
    return { name: s?.name ?? "Unknown", value: inv.amount };
  });

  const topStartups = startups
    .map((s) => ({ ...s, report: analyzeStartup(s) }))
    .sort((a, b) => b.report.score - a.report.score)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold text-white">Investor Dashboard</h1>
        <p className="mb-8 text-slate-400">Your portfolio, AI insights, and startup picks</p>

        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
            <p className="text-sm text-slate-400">Total Invested</p>
            <p className="text-2xl font-bold text-emerald-400">{formatINR(totalInvested)}</p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
            <p className="text-sm text-slate-400">Investments</p>
            <p className="text-2xl font-bold text-white">{investments.length}</p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
            <p className="text-sm text-slate-400">Startups Listed</p>
            <p className="text-2xl font-bold text-white">{startups.length}</p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
            <p className="text-sm text-slate-400">Risk-Free Picks</p>
            <p className="text-2xl font-bold text-emerald-400">
              {topStartups.filter((s) => s.report.riskFree).length}
            </p>
          </div>
        </div>
        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          <div>
            <DashboardAI role="investor" />
          </div>
          <div className="lg:col-span-2">
            {portfolioData.length > 0 ? (
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
                <h2 className="mb-4 font-semibold text-white">Portfolio Allocation</h2>
                <PortfolioChart data={portfolioData} />
              </div>
            ) : (
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
                <h2 className="mb-2 font-semibold text-white">Portfolio</h2>
                <p className="text-slate-400">No investments yet. Browse startups to invest.</p>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 font-semibold text-white">Top Startups by AI Score</h2>
          {topStartups.length === 0 ? (
            <p className="rounded-lg border border-slate-700 bg-slate-800/50 p-6 text-slate-400">
              No startups yet. Browse and invest.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {topStartups.map((s) => (
                <Link
                  key={s.id}
                  href={`/startups/${s.id}`}
                  className="rounded-xl border border-slate-700 bg-slate-800/50 p-5 transition hover:border-emerald-600/50"
                >
                  <div className="mb-2 flex items-center gap-3">
                    <StartupImage name={s.name} size={48} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{s.name}</h3>
                      {s.report.riskFree && (
                        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">
                          Risk-Free
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-emerald-400">Score: {s.report.score}</span>
                    <span className="text-slate-400">Risk: {s.report.riskScore}</span>
                  </div>
                  <p className="mt-2 text-slate-500">{formatINR(s.valuation)}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="mb-4 font-semibold text-white">My Investments</h2>
          {investments.length === 0 ? (
            <p className="rounded-lg border border-slate-700 bg-slate-800/50 p-6 text-slate-400">
              No investments yet. Browse startups to invest.
            </p>
          ) : (
            <div className="space-y-3">
              {investments.map((inv) => {
                const s = store.startups.get(inv.startupId);
                return (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4"
                  >
                    <span className="font-medium text-white">{s?.name ?? "Unknown"}</span>
                    <span className="text-emerald-400">{formatINR(inv.amount)}</span>
                    <span className="text-slate-400">{inv.equity.toFixed(2)}% equity</span>
                    <Link
                      href={`/startups/${inv.startupId}`}
                      className="text-emerald-400 hover:underline"
                    >
                      View
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Link
          href="/startups"
          className="inline-block rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-500"
        >
          Browse All Startups
        </Link>

        <p className="mt-8 text-sm text-slate-500">
          <Link href="/legal" className="text-emerald-500 hover:underline">
            Legal, SEBI & Risk Disclosure
          </Link>
        </p>
      </div>
      <Footer />
    </div>
  );
}
