"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { store } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import { analyzeStartup } from "@/lib/ai";
import StartupImage from "@/components/StartupImage";
import BankAIChatbot from "@/components/BankAIChatbot";
import DashboardAI from "@/components/DashboardAI";
import { RevenueChart, BurnVsRevenueChart, MetricsPieChart } from "@/components/Charts";
import type { LoanRequest, Startup } from "@/lib/types";

export default function BankDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [loans, setLoans] = useState<LoanRequest[]>([]);
  const [expandedLoanId, setExpandedLoanId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState<string | null>(null);
  const [chatMsg, setChatMsg] = useState("");
  const [chatMap, setChatMap] = useState<Record<string, { sender: string; text: string }[]>>({});

  useEffect(() => {
    if (!user || user.role !== "bank") {
      router.push("/login");
      return;
    }
    setLoans(store.loans.getAll().filter((l) => l.status === "pending"));
  }, [user, router]);

  const handleApprove = (id: string) => {
    store.loans.update(id, "approved");
    setLoans(store.loans.getAll().filter((l) => l.status === "pending"));
    setExpandedLoanId(null);
  };

  const handleReject = (id: string) => {
    store.loans.update(id, "rejected");
    setLoans(store.loans.getAll().filter((l) => l.status === "pending"));
    setExpandedLoanId(null);
  };

  const loadChat = (loanId: string, ownerId: string) => {
    if (!user) return;
    const loan = store.loans.getAll().find((l) => l.id === loanId);
    if (!loan) return;
    const startup = store.startups.get(loan.startupId);
    if (!startup) return;
    const msgs = store.chats.between(user.id, startup.ownerId);
    setChatMap((prev) => ({
      ...prev,
      [loanId]: msgs.map((m) => ({
        sender: m.senderId === user.id ? "You" : "Founder",
        text: m.content,
      })),
    }));
  };

  const sendChat = (loanId: string) => {
    if (!chatMsg.trim() || !user) return;
    const loan = store.loans.getAll().find((l) => l.id === loanId);
    if (!loan) return;
    const startup = store.startups.get(loan.startupId);
    if (!startup) return;
    store.chats.add({
      id: crypto.randomUUID(),
      senderId: user.id,
      receiverId: startup.ownerId,
      content: chatMsg,
      timestamp: new Date().toISOString(),
    });
    setChatMsg("");
    const msgs = store.chats.between(user.id, startup.ownerId);
    setChatMap((prev) => ({
      ...prev,
      [loanId]: msgs.map((m) => ({
        sender: m.senderId === user.id ? "You" : "Founder",
        text: m.content,
      })),
    }));
  };

  if (!user) return null;

  const allLoans = store.loans.getAll();

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold text-white">Bank Dashboard</h1>
        <p className="mb-8 text-slate-400">
          Review loan requests. View full startup details, valuation, graphs. Chat with founders. Use AI.
        </p>

        <div className="mb-8">
          <DashboardAI role="bank" />
        </div>

        <div className="mb-8">
          <h2 className="mb-4 font-semibold text-white">Pending Loan Requests</h2>
          {loans.length === 0 ? (
            <p className="rounded-lg border border-slate-700 bg-slate-800/50 p-8 text-center text-slate-400">
              No pending loan requests.
            </p>
          ) : (
            <div className="space-y-4">
              {loans.map((l) => {
                const startup = store.startups.get(l.startupId) as Startup | undefined;
                const report = startup ? analyzeStartup(startup) : null;
                const expanded = expandedLoanId === l.id;
                const chatting = showChat === l.id;
                const chats = chatMap[l.id] ?? [];

                return (
                  <div
                    key={l.id}
                    className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800/50"
                  >
                    <div
                      className="flex cursor-pointer items-start gap-4 p-6"
                      onClick={() => setExpandedLoanId(expanded ? null : l.id)}
                    >
                      <StartupImage name={l.startupName} size={64} />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{l.startupName}</h3>
                        <p className="text-2xl font-bold text-emerald-400">{formatINR(l.amount)}</p>
                        <p className="text-sm text-slate-400">{l.purpose}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {expanded ? "▼ Click to collapse" : "▶ Click for full startup details"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(l.id);
                          }}
                          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                        >
                          Approve
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReject(l.id);
                          }}
                          className="rounded-lg border border-red-600 bg-red-900/30 px-4 py-2 text-sm text-red-400 hover:bg-red-900/50"
                        >
                          Reject
                        </button>
                      </div>
                    </div>

                    {expanded && startup && (
                      <div className="border-t border-slate-700 bg-slate-900/50 p-6">
                        <h4 className="mb-4 font-semibold text-white">Startup Details & Valuation</h4>
                        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                          <div>
                            <p className="text-xs text-slate-500">Valuation</p>
                            <p className="text-lg font-bold text-emerald-400">{formatINR(startup.valuation)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Revenue</p>
                            <p>{formatINR(startup.revenue)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Turnover</p>
                            <p>{formatINR(startup.turnover)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Profit Margin</p>
                            <p>{startup.profitMargin}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Burn Rate</p>
                            <p>{formatINR(startup.burnRate)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Industry</p>
                            <p>{startup.industry}</p>
                          </div>
                        </div>
                        <p className="mb-6 text-sm text-slate-400">{startup.description}</p>

                        <div className="mb-6 grid gap-6 lg:grid-cols-3">
                          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                            <h5 className="mb-2 text-sm font-medium text-white">Revenue Trend</h5>
                            <RevenueChart startup={startup} />
                          </div>
                          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                            <h5 className="mb-2 text-sm font-medium text-white">Burn vs Revenue</h5>
                            <BurnVsRevenueChart startup={startup} />
                          </div>
                          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                            <h5 className="mb-2 text-sm font-medium text-white">Metrics</h5>
                            <MetricsPieChart startup={startup} />
                          </div>
                        </div>

                        {report && (
                          <div className="mb-6 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                            <h5 className="mb-2 font-medium text-white">AI Investment Score</h5>
                            <p>
                              Score: {report.score}/100 • Risk: {report.riskScore}/100 ({report.riskLevel})
                              {report.riskFree && " • Risk-Free Zone"}
                            </p>
                          </div>
                        )}

                        <div className="mb-4 flex flex-wrap gap-3">
                          <Link
                            href={`/startups/${startup.id}`}
                            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600"
                          >
                            View Full Startup →
                          </Link>
                          <Link
                            href={`/startups/${startup.id}#chat`}
                            className="rounded-lg border border-slate-600 px-4 py-2 text-sm hover:bg-slate-700"
                          >
                            Chat with Founder →
                          </Link>
                          <button
                            onClick={() => {
                              setShowChat(chatting ? null : l.id);
                              if (!chatting) loadChat(l.id, startup.ownerId);
                            }}
                            className="rounded-lg border border-slate-600 px-4 py-2 text-sm hover:bg-slate-700"
                          >
                            {chatting ? "Close Chat" : "Chat with Founder"}
                          </button>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                          <BankAIChatbot loan={l} startup={startup} />
                          {chatting && (
                            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
                              <h5 className="mb-3 font-medium text-white">1:1 Chat with Founder</h5>
                              <div className="mb-3 max-h-40 space-y-2 overflow-y-auto">
                                {chats.map((m, i) => (
                                  <div
                                    key={i}
                                    className={`rounded p-2 text-sm ${
                                      m.sender === "You" ? "ml-6 bg-blue-900/30" : "mr-6 bg-slate-700/50"
                                    }`}
                                  >
                                    {m.sender}: {m.text}
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <input
                                  value={chatMsg}
                                  onChange={(e) => setChatMsg(e.target.value)}
                                  placeholder="Message founder..."
                                  className="flex-1 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white"
                                />
                                <button
                                  onClick={() => sendChat(l.id)}
                                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500"
                                >
                                  Send
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-4 font-semibold text-white">All Loan History</h2>
          <div className="space-y-3">
            {allLoans.map((l) => (
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
        </div>
      </div>
    </div>
  );
}
