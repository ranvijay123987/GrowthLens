"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { store } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import { analyzeStartup } from "@/lib/ai";
import DashboardAI from "@/components/DashboardAI";
import type { User, Startup, Investment } from "@/lib/types";

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [expandedStartupId, setExpandedStartupId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login");
      return;
    }
    setUsers(store.users.getAll());
    setStartups(store.startups.getAll());
    setInvestments(store.investments.getAll());
  }, [user, router]);

  const handleApproveStartup = (id: string) => {
    store.startups.update(id, { status: "approved" });
    setStartups(store.startups.getAll());
  };

  const handleRejectStartup = (id: string) => {
    store.startups.update(id, { status: "rejected" });
    setStartups(store.startups.getAll());
  };

  if (!user) return null;

  const pendingStartups = startups.filter((s) => s.status === "pending");
  const totalInvested = investments.reduce((s, i) => s + i.amount, 0);
  const loans = store.loans.getAll();

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="mb-8 text-slate-400">Review startups, documents, approve or reject.</p>

        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
            <h3 className="mb-4 font-semibold text-white">Platform Stats</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div><p className="text-sm text-slate-400">Users</p><p className="text-xl font-bold text-white">{users.length}</p></div>
              <div><p className="text-sm text-slate-400">Startups</p><p className="text-xl font-bold text-white">{startups.length}</p></div>
              <div><p className="text-sm text-slate-400">Investments</p><p className="text-xl font-bold text-emerald-400">{formatINR(totalInvested)}</p></div>
              <div><p className="text-sm text-slate-400">Loans</p><p className="text-xl font-bold text-white">{loans.length}</p></div>
            </div>
          </div>
          <DashboardAI role="admin" />
        </div>

        <div className="mb-8">
          <h2 className="mb-4 font-semibold text-white">Pending Startups — Review Documents & Approve</h2>
          {pendingStartups.length === 0 ? (
            <p className="rounded-lg border border-slate-700 bg-slate-800/50 p-6 text-slate-400">
              No pending startups.
            </p>
          ) : (
            <div className="space-y-4">
              {pendingStartups.map((s) => {
                const expanded = expandedStartupId === s.id;
                const report = analyzeStartup(s);
                return (
                  <div
                    key={s.id}
                    className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800/50"
                  >
                    <div
                      className="flex cursor-pointer items-center justify-between p-5"
                      onClick={() => setExpandedStartupId(expanded ? null : s.id)}
                    >
                      <div>
                        <h3 className="font-semibold text-white">{s.name}</h3>
                        <p className="text-sm text-slate-400">{s.industry} • {s.founderName}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {expanded ? "▼ Collapse" : "▶ Click to view documents & full details"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                        <Link
                          href={`/startups/${s.id}#chat`}
                          className="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600"
                        >
                          Chat
                        </Link>
                        <button
                          onClick={() => handleApproveStartup(s.id)}
                          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectStartup(s.id)}
                          className="rounded-lg border border-red-600 bg-red-900/30 px-4 py-2 text-sm text-red-400"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                    {expanded && (
                      <div className="border-t border-slate-700 bg-slate-900/50 p-6">
                        <h4 className="mb-4 font-medium text-white">Documents</h4>
                        {s.documents && s.documents.length > 0 ? (
                          <ul className="mb-6 space-y-2">
                            {s.documents.map((d, i) => (
                              <li key={i} className="flex items-start gap-2 rounded-lg bg-slate-800/50 p-3">
                                <span className="font-medium text-emerald-400">{d.name}</span>
                                {d.description && <span className="text-slate-400">— {d.description}</span>}
                                {d.url && (
                                  <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                    View
                                  </a>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mb-6 text-slate-500">No documents submitted.</p>
                        )}
                        <h4 className="mb-2 font-medium text-white">Description</h4>
                        <p className="mb-6 text-slate-400">{s.description}</p>
                        <h4 className="mb-2 font-medium text-white">Metrics</h4>
                        <div className="mb-6 grid gap-2 text-sm md:grid-cols-4">
                          <div><span className="text-slate-500">Valuation</span><p>{formatINR(s.valuation)}</p></div>
                          <div><span className="text-slate-500">Revenue</span><p>{formatINR(s.revenue)}</p></div>
                          <div><span className="text-slate-500">Turnover</span><p>{formatINR(s.turnover)}</p></div>
                          <div><span className="text-slate-500">Profit Margin</span><p>{s.profitMargin}%</p></div>
                        </div>
                        <h4 className="mb-2 font-medium text-white">AI Score (pre-approval)</h4>
                        <p className="mb-4 text-slate-400">Score: {report.score}/100 • Risk: {report.riskScore}/100</p>
                        <div className="flex flex-wrap gap-3">
                          <Link
                            href={`/startups/${s.id}`}
                            className="rounded-lg bg-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-600"
                          >
                            View Startup Page
                          </Link>
                          <Link
                            href={`/startups/${s.id}#chat`}
                            className="rounded-lg border border-emerald-600 px-4 py-2 text-sm text-emerald-400 hover:bg-emerald-600/20"
                          >
                            1:1 Chat with Startup →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="mb-4 font-semibold text-white">All Startups — 1:1 Chat</h2>
          {startups.length === 0 ? (
            <p className="rounded-lg border border-slate-700 bg-slate-800/50 p-6 text-slate-400">No startups.</p>
          ) : (
            <div className="mb-8 flex flex-wrap gap-3">
              {startups.map((s) => (
                <Link
                  key={s.id}
                  href={`/startups/${s.id}#chat`}
                  className="rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-sm hover:border-emerald-600/50"
                >
                  {s.name} — Chat
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="mb-4 font-semibold text-white">All Users</h2>
          <div className="overflow-x-auto rounded-lg border border-slate-700">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800/50">
                  <th className="px-4 py-3 text-slate-400">Name</th>
                  <th className="px-4 py-3 text-slate-400">Email</th>
                  <th className="px-4 py-3 text-slate-400">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-700">
                    <td className="px-4 py-3 text-white">{u.name}</td>
                    <td className="px-4 py-3 text-slate-400">{u.email}</td>
                    <td className="px-4 py-3 capitalize text-slate-300">{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
          <h2 className="mb-2 font-semibold text-white">Platform Overview</h2>
          <p className="text-slate-400">
            Startups: {startups.filter((s) => s.status === "approved").length} approved, {pendingStartups.length} pending.
            Investments: {formatINR(totalInvested)}. Loans: {loans.filter((l) => l.status === "approved").length} approved.
          </p>
        </div>
      </div>
    </div>
  );
}
