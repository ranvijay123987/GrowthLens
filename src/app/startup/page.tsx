"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import DashboardAI from "@/components/DashboardAI";
import { useAuth } from "@/context/AuthContext";
import { store } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import type { Startup, LoanRequest } from "@/lib/types";

export default function StartupOwnerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [myStartups, setMyStartups] = useState<Startup[]>([]);
  const [loans, setLoans] = useState<LoanRequest[]>([]);
  const [showRegister, setShowRegister] = useState(false);
  const [showMetrics, setShowMetrics] = useState<string | null>(null);
  const [showLoanForm, setShowLoanForm] = useState<string | null>(null);
  const [loanAmount, setLoanAmount] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [form, setForm] = useState({
    name: "",
    industry: "",
    description: "",
    founderName: "",
    documents: "",
  });
  const [metrics, setMetrics] = useState({
    valuation: 0,
    fundingRound: "Seed",
    investmentRequired: 0,
    equityOffered: 0,
    revenue: 0,
    turnover: 0,
    profitMargin: 0,
    burnRate: 0,
    customerGrowth: 0,
    fundingRaised: 0,
  });

  useEffect(() => {
    if (!user || user.role !== "startup") {
      router.push("/login");
      return;
    }
    const mine = store.startups.getAll().filter((s) => s.ownerId === user.id);
    setMyStartups(mine);
    setLoans(store.loans.getAll().filter((l) => mine.some((s) => s.id === l.startupId)));
  }, [user, router]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.name.trim()) return;
    const docs = form.documents
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const idx = line.indexOf(":");
        const name = idx > 0 ? line.slice(0, idx).trim() : line;
        const rest = idx > 0 ? line.slice(idx + 1).trim() : "";
        const isUrl = rest.startsWith("http");
        return { name, ...(isUrl ? { url: rest } : rest ? { description: rest } : {}) };
      });
    const s: Startup = {
      id: crypto.randomUUID(),
      name: form.name,
      industry: form.industry,
      description: form.description,
      founderName: form.founderName || user.name,
      ownerId: user.id,
      status: "pending",
      valuation: 0,
      fundingRound: "Seed",
      investmentRequired: 0,
      equityOffered: 0,
      revenue: 0,
      turnover: 0,
      profitMargin: 0,
      burnRate: 0,
      customerGrowth: 0,
      fundingRaised: 0,
      revenueHistory: [],
      documents: docs.length ? docs : [{ name: "Business Plan", description: "To be submitted" }],
      createdAt: new Date().toISOString(),
    };
    store.startups.add(s);
    setMyStartups(store.startups.getAll().filter((x) => x.ownerId === user.id));
    setShowRegister(false);
    setForm({ name: "", industry: "", description: "", founderName: "", documents: "" });
  };

  const handleSaveMetrics = (startupId: string) => {
    const s = store.startups.get(startupId);
    if (!s) return;
    store.startups.update(startupId, {
      ...metrics,
      revenueHistory: [
        { month: "Jan", value: metrics.revenue * 0.7 },
        { month: "Feb", value: metrics.revenue * 0.85 },
        { month: "Mar", value: metrics.revenue },
      ],
    });
    setMyStartups(store.startups.getAll().filter((x) => x.ownerId === user?.id));
    setShowMetrics(null);
  };

  const handleApplyLoan = (startupId: string) => {
    const s = store.startups.get(startupId);
    if (!s || !loanAmount || !loanPurpose) return;
    store.loans.add({
      id: crypto.randomUUID(),
      startupId,
      startupName: s.name,
      amount: parseInt(loanAmount, 10),
      purpose: loanPurpose,
      status: "pending",
      revenue: s.revenue,
      turnover: s.turnover,
      createdAt: new Date().toISOString(),
    });
    setLoans(store.loans.getAll().filter((l) => myStartups.some((x) => x.name === l.startupName)));
    setShowLoanForm(null);
    setLoanAmount("");
    setLoanPurpose("");
  };

  if (!user) return null;

  const myLoans = store.loans.getAll().filter((l) => myStartups.some((s) => s.id === l.startupId));

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold text-white">Startup Owner Dashboard</h1>
        <p className="mb-8 text-slate-400">Register startup, add documents, get approved</p>

        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <DashboardAI role="startup" />
          <div />
        </div>

        <div className="mb-8">
          <button
            onClick={() => setShowRegister(true)}
            className="rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-500"
          >
            Register Startup
          </button>
        </div>

        {showRegister && (
          <div className="mb-8 rounded-xl border border-slate-700 bg-slate-800/50 p-6">
            <h3 className="mb-4 font-semibold text-white">Register Startup</h3>
            <form onSubmit={handleRegister} className="space-y-4">
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Startup Name"
                className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white"
                required
              />
              <input
                value={form.industry}
                onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
                placeholder="Industry"
                className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white"
              />
              <input
                value={form.founderName}
                onChange={(e) => setForm((f) => ({ ...f, founderName: e.target.value }))}
                placeholder="Founder Name"
                className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white"
              />
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Description"
                rows={3}
                className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white"
              />
              <div>
                <label className="mb-1 block text-sm text-slate-400">Documents (one per line, e.g. Pitch Deck: URL or Financial Statements: description)</label>
                <textarea
                  value={form.documents}
                  onChange={(e) => setForm((f) => ({ ...f, documents: e.target.value }))}
                  placeholder="Pitch Deck: https://...&#10;Financial Statements: Q1 2025&#10;Incorporation Certificate"
                  rows={3}
                  className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-500">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowRegister(false)}
                  className="rounded-lg border border-slate-600 px-4 py-2 hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mb-8">
          <h2 className="mb-4 font-semibold text-white">My Startups</h2>
          {myStartups.length === 0 ? (
            <p className="rounded-lg border border-slate-700 bg-slate-800/50 p-6 text-slate-400">
              No startups yet. Register one above.
            </p>
          ) : (
            <div className="space-y-4">
              {myStartups.map((s) => (
                <div
                  key={s.id}
                  className="rounded-xl border border-slate-700 bg-slate-800/50 p-5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{s.name}</h3>
                      <p className="text-sm text-slate-400">
                        {s.industry} • Status: {s.status}
                      </p>
                      {s.status === "approved" && (
                        <p className="mt-2 text-sm text-emerald-400">
                          Valuation: {formatINR(s.valuation)} • Seeking: {formatINR(s.investmentRequired)}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setShowMetrics(s.id);
                          setMetrics({
                            valuation: s.valuation,
                            fundingRound: s.fundingRound,
                            investmentRequired: s.investmentRequired,
                            equityOffered: s.equityOffered,
                            revenue: s.revenue,
                            turnover: s.turnover,
                            profitMargin: s.profitMargin,
                            burnRate: s.burnRate,
                            customerGrowth: s.customerGrowth,
                            fundingRaised: s.fundingRaised,
                          });
                        }}
                        className="rounded bg-slate-700 px-3 py-1 text-sm hover:bg-slate-600"
                      >
                        Add Metrics
                      </button>
                      <button
                        onClick={() => setShowLoanForm(s.id)}
                        className="rounded bg-slate-700 px-3 py-1 text-sm hover:bg-slate-600"
                      >
                        Apply for Loan
                      </button>
                      <Link
                        href={`/startups/${s.id}`}
                        className="rounded bg-emerald-600 px-3 py-1 text-sm text-white hover:bg-emerald-500"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showMetrics && (
          <div className="mb-8 rounded-xl border border-slate-700 bg-slate-800/50 p-6">
            <h3 className="mb-4 font-semibold text-white">Add Business Metrics</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { key: "valuation", label: "Valuation (₹)" },
                { key: "revenue", label: "Revenue (₹)" },
                { key: "turnover", label: "Turnover (₹)" },
                { key: "investmentRequired", label: "Investment Required (₹)" },
                { key: "equityOffered", label: "Equity Offered (%)" },
                { key: "profitMargin", label: "Profit Margin (%)" },
                { key: "burnRate", label: "Burn Rate (₹)" },
                { key: "customerGrowth", label: "Customer Growth (%)" },
                { key: "fundingRaised", label: "Funding Raised (₹)" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="mb-1 block text-sm text-slate-400">{label}</label>
                  <input
                    type="number"
                    value={(metrics as Record<string, number | string>)[key] ?? ""}
                    onChange={(e) =>
                      setMetrics((m) => ({
                        ...m,
                        [key]: key.includes("Offered") || key.includes("Margin") || key.includes("Growth")
                          ? parseFloat(e.target.value) || 0
                          : parseInt(e.target.value, 10) || 0,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                  />
                </div>
              ))}
              <div>
                <label className="mb-1 block text-sm text-slate-400">Funding Round</label>
                <select
                  value={metrics.fundingRound}
                  onChange={(e) => setMetrics((m) => ({ ...m, fundingRound: e.target.value }))}
                  className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                >
                  <option>Seed</option>
                  <option>Series A</option>
                  <option>Series B</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => showMetrics && handleSaveMetrics(showMetrics)}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-500"
              >
                Save Metrics
              </button>
              <button
                onClick={() => setShowMetrics(null)}
                className="rounded-lg border border-slate-600 px-4 py-2 hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showLoanForm && (
          <div className="mb-8 rounded-xl border border-slate-700 bg-slate-800/50 p-6">
            <h3 className="mb-4 font-semibold text-white">Apply for Loan</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-slate-400">Loan Amount (₹)</label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-400">Purpose</label>
                <textarea
                  value={loanPurpose}
                  onChange={(e) => setLoanPurpose(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => showLoanForm && handleApplyLoan(showLoanForm)}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-500"
                >
                  Submit
                </button>
                <button
                  onClick={() => setShowLoanForm(null)}
                  className="rounded-lg border border-slate-600 px-4 py-2 hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 className="mb-4 font-semibold text-white">My Loan Requests</h2>
          {myLoans.length === 0 ? (
            <p className="rounded-lg border border-slate-700 bg-slate-800/50 p-6 text-slate-400">
              No loan requests.
            </p>
          ) : (
            <div className="space-y-3">
              {myLoans.map((l) => (
                <div
                  key={l.id}
                  className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4"
                >
                  <span className="text-white">{l.startupName}</span>
                  <span className="text-emerald-400">{formatINR(l.amount)}</span>
                  <span
                    className={`rounded px-2 py-1 text-sm ${
                      l.status === "approved"
                        ? "bg-emerald-900/50 text-emerald-400"
                        : l.status === "rejected"
                        ? "bg-red-900/50 text-red-400"
                        : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {l.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
