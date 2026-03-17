"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { store } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";
import { formatINR } from "@/lib/utils";
import { analyzeStartup } from "@/lib/ai";
import AIChatbot from "@/components/AIChatbot";
import StartupImage from "@/components/StartupImage";
import {
  RevenueChart,
  BurnVsRevenueChart,
  MetricsPieChart,
} from "@/components/Charts";
import type { Startup, AIReport } from "@/lib/types";

export default function StartupDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [report, setReport] = useState<AIReport | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatWithId, setChatWithId] = useState<string | null>(null); // for startup owner: who to chat with
  const [chatMsg, setChatMsg] = useState("");
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([]);
  const [showInvest, setShowInvest] = useState(false);
  const [investAmount, setInvestAmount] = useState("");
  const [investDone, setInvestDone] = useState(false);

  const id = params.id as string;

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#chat" && user) setShowChat(true);
  }, [user]);


  const loadChat = () => {
    if (!user || !startup) return;
    const partnerId = user.id === startup.ownerId ? chatWithId : startup.ownerId;
    if (!partnerId) {
      setChatMessages([]);
      return;
    }
    const msgs = store.chats.between(user.id, partnerId);
    const partner = store.users.get(partnerId);
    const partnerName = partner ? `${partner.name} (${partner.role})` : "User";
    setChatMessages(
      msgs.map((m) => ({
        sender: m.senderId === user.id ? "You" : partnerName,
        text: m.content,
      }))
    );
  };

  useEffect(() => {
    const s = store.startups.get(id);
    setStartup(s ?? null);
    if (s) setReport(analyzeStartup(s));
  }, [id]);

  useEffect(() => {
    if (user && startup) loadChat();
  }, [id, user?.id, startup?.ownerId, chatWithId]);

  const handleSendChat = () => {
    if (!chatMsg.trim() || !user || !startup) return;
    const receiverId = user.id === startup.ownerId ? chatWithId : startup.ownerId;
    if (!receiverId) return;
    store.chats.add({
      id: crypto.randomUUID(),
      senderId: user.id,
      receiverId,
      content: chatMsg,
      timestamp: new Date().toISOString(),
    });
    setChatMsg("");
    loadChat();
  };

  const conversationPartners =
    startup && user?.id === startup.ownerId
      ? [...new Set(
          store.chats
            .involving(startup.ownerId)
            .map((m) => (m.senderId === startup.ownerId ? m.receiverId : m.senderId))
            .filter((x) => x !== startup.ownerId)
        )]
          .map((uid) => store.users.get(uid))
          .filter((u): u is NonNullable<typeof u> => !!u)
      : [];

  const canChat = user && startup && (user.id === startup.ownerId ? chatWithId : true);

  const handleInvest = () => {
    const amt = parseInt(investAmount, 10);
    if (isNaN(amt) || amt <= 0 || !user) return;
    const equity = (amt / startup!.valuation) * 100;
    store.investments.add({
      id: crypto.randomUUID(),
      startupId: startup!.id,
      investorId: user.id,
      amount: amt,
      equity,
      createdAt: new Date().toISOString(),
    });
    setInvestDone(true);
    setShowInvest(false);
  };

  const equityCalc =
    startup && startup.valuation > 0 && investAmount
      ? ((parseInt(investAmount, 10) || 0) / startup.valuation) * 100
      : 0;

  if (!startup) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <p className="text-slate-400">Startup not found.</p>
          <Link href="/startups" className="mt-4 inline-block text-emerald-400 hover:underline">
            Back to Startups
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Link href="/startups" className="mb-6 inline-block text-slate-400 hover:text-white">
          ← Back to Startups
        </Link>

        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <StartupImage name={startup.name} size={80} src={startup.image} />
            <div>
                <h1 className="text-3xl font-bold text-white">{startup.name}</h1>
                {report?.riskFree && (
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm font-medium text-emerald-400">
                    ✓ AI Risk-Free
                  </span>
                )}
              <p className="text-slate-400">{startup.industry} • {startup.founderName}</p>
            </div>
          </div>
          {user?.role === "investor" && (
            <button
              onClick={() => setReport(analyzeStartup(startup))}
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800"
            >
              Refresh AI
            </button>
          )}
        </div>

        {report && (
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
              <p className="mb-1 text-sm text-slate-400">Investment Score</p>
              <p className="text-3xl font-bold text-emerald-400">{report.score}/100</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
              <p className="mb-1 text-sm text-slate-400">Risk Score</p>
              <p className="text-3xl font-bold text-white">{report.riskScore}/100</p>
              <p className="mt-1 capitalize text-slate-300">{report.riskLevel} Risk</p>
              {report.riskFree && <p className="mt-2 text-sm font-medium text-emerald-400">✓ Risk-Free Zone</p>}
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
              <p className="mb-1 text-sm text-slate-400">AI Recommendation</p>
              <p className="text-white">{report.recommendation}</p>
            </div>
          </div>
        )}

        {report?.riskFactors && report.riskFactors.length > 0 && (
          <div className="mb-8 rounded-xl border border-slate-700 bg-slate-800/50 p-5">
            <h3 className="mb-3 font-semibold text-white">Risk Factors</h3>
            <ul className="space-y-1 text-sm text-slate-300">
              {report.riskFactors.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-slate-500">•</span> {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
            <h3 className="mb-3 font-semibold text-white">Revenue Trend</h3>
            <RevenueChart startup={startup} />
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
            <h3 className="mb-3 font-semibold text-white">Burn vs Revenue</h3>
            <BurnVsRevenueChart startup={startup} />
          </div>
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
            <h3 className="mb-3 font-semibold text-white">Key Metrics</h3>
            <div className="space-y-2 text-sm">
              {[
                ["Valuation", formatINR(startup.valuation), "emerald"],
                ["Investment Required", formatINR(startup.investmentRequired), ""],
                ["Equity Offered", `${startup.equityOffered}%`, ""],
                ["Revenue", formatINR(startup.revenue), ""],
                ["Turnover", formatINR(startup.turnover), ""],
                ["Profit Margin", `${startup.profitMargin}%`, ""],
                ["Burn Rate", formatINR(startup.burnRate), ""],
                ["Customer Growth", `${startup.customerGrowth}%`, ""],
              ].map(([label, val, col]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-slate-400">{label}</span>
                  <span className={col === "emerald" ? "text-emerald-400" : ""}>{val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 rounded-xl border border-slate-700 bg-slate-800/50 p-5">
            <h3 className="mb-3 font-semibold text-white">Metrics Distribution</h3>
            <MetricsPieChart startup={startup} />
          </div>
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
            <h3 className="mb-3 font-semibold text-white">Growth Prediction</h3>
            <p className="text-slate-300">{report?.growthPrediction ?? "Run AI Analysis to get prediction."}</p>
          </div>
          <AIChatbot startup={startup} report={report} />
        </div>

        {!user && (
          <div className="mb-6 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
            <p className="text-slate-400">
              <Link href="/login" className="text-emerald-400 hover:underline">Login</Link> or{" "}
              <Link href="/signup?role=investor" className="text-emerald-400 hover:underline">Sign up as Investor</Link>{" "}
              to invest and chat with founder.
            </p>
          </div>
        )}
        {user && (user.role === "investor" || user.role === "startup" || user.role === "bank" || user.role === "admin" || user.id === startup.ownerId) && (
          <div className="mb-8 flex flex-wrap gap-3">
            <button
              onClick={() => setShowChat(!showChat)}
              className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 hover:bg-slate-700"
            >
              Chat
            </button>
            {user.role === "investor" && (
              <button
                onClick={() => setShowInvest(true)}
                className="rounded-lg border border-emerald-600 bg-emerald-600/20 px-4 py-2 text-emerald-400 hover:bg-emerald-600/30"
              >
                Invest Now
              </button>
            )}
          </div>
        )}

        <div id="chat" className="scroll-mt-24">
        {showChat && user && (
          <div className="mb-8 rounded-xl border border-slate-700 bg-slate-800/50 p-6">
            <h3 className="mb-3 font-semibold text-white">
              {user.id === startup.ownerId ? "Chat with Investor/Bank/Admin" : "Chat with Founder"}
            </h3>
            {user.id === startup.ownerId && (
              <div className="mb-3">
                <label className="mb-1 block text-sm text-slate-400">Select conversation</label>
                <select
                  value={chatWithId ?? ""}
                  onChange={(e) => setChatWithId(e.target.value || null)}
                  className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                >
                  <option value="">— Select who to chat with —</option>
                  {conversationPartners.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
                {conversationPartners.length === 0 && (
                  <p className="mt-1 text-sm text-slate-500">No conversations yet. Investors/Banks/Admins can start a chat.</p>
                )}
              </div>
            )}
            <div className="mb-3 max-h-48 space-y-2 overflow-y-auto">
              {chatMessages.map((m, i) => (
                <div
                  key={i}
                  className={`rounded p-2 ${
                    m.sender === "You" ? "ml-8 bg-emerald-900/30" : "mr-8 bg-slate-700/50"
                  }`}
                >
                  <span className="text-xs text-slate-500">{m.sender}: </span>
                  {m.text}
                </div>
              ))}
            </div>
            {canChat && (
            <div className="flex gap-2">
              <input
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
                placeholder="Type message..."
                className="flex-1 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
              />
              <button
                onClick={handleSendChat}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-500"
              >
                Send
              </button>
            </div>
            )}
          </div>
        )}
        </div>

        {showInvest && user?.role === "investor" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6">
              <h3 className="mb-4 text-xl font-semibold text-white">Invest Now</h3>
              <p className="mb-3 text-xs text-slate-500">
                By investing you agree to our{" "}
                <Link href="/legal" className="text-emerald-500 hover:underline">
                  Terms & Risk Disclosure
                </Link>
                . SEBI regulations apply.
              </p>
              <p className="mb-2 text-slate-400">Valuation: {formatINR(startup.valuation)}</p>
              <input
                type="number"
                value={investAmount}
                onChange={(e) => setInvestAmount(e.target.value)}
                placeholder="Amount in ₹"
                className="mb-3 w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white"
              />
              <p className="mb-4 text-sm text-slate-400">Equity: {equityCalc.toFixed(2)}%</p>
              <div className="flex gap-3">
                <button
                  onClick={handleInvest}
                  className="flex-1 rounded-lg bg-emerald-600 py-2 font-medium text-white hover:bg-emerald-500"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowInvest(false)}
                  className="rounded-lg border border-slate-600 px-4 py-2 hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {investDone && (
          <div className="mb-8 rounded-lg bg-emerald-900/30 p-4 text-emerald-400">
            Investment recorded successfully!
          </div>
        )}
      </div>
    </div>
  );
}
