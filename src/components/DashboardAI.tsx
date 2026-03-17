"use client";

import { useState, useRef, useEffect } from "react";
import { store } from "@/lib/store";
import { analyzeStartup, answerAIQuestion, answerBankAIQuestion } from "@/lib/ai";
import { formatINR } from "@/lib/utils";
import type { UserRole } from "@/lib/types";

const QUICK_BY_ROLE: Record<UserRole, string[]> = {
  investor: ["Should I invest in this startup?", "Which startup is risk-free?", "Best investment opportunity?", "What to check before investing?"],
  startup: ["How to improve my pitch?", "What metrics matter to investors?", "Is my valuation fair?", "How to attract investors?"],
  bank: ["Which loan requests are low risk?", "What's the platform loan risk?", "Credit assessment guidelines?", "Approval criteria?"],
  admin: ["Platform health overview?", "Any high-risk startups?", "Investment trends?", "Compliance check?"],
};

function getAIResponse(question: string, role: UserRole): string {
  const q = question.toLowerCase();
  const startups = store.startups.getApproved();
  const topStartup = startups.length ? startups[0] : null;
  const report = topStartup ? analyzeStartup(topStartup) : null;

  if (role === "investor") {
    if (topStartup && (q.includes("invest") || q.includes("risk-free") || q.includes("opportunity"))) {
      return answerAIQuestion(q, topStartup, report);
    }
    if (q.includes("which") || q.includes("best")) {
      const sorted = startups.map((s) => ({ s, r: analyzeStartup(s) })).sort((a, b) => b.r.score - a.r.score);
      if (sorted.length === 0) return "No startups listed yet. Browse once startups are approved.";
      const top = sorted[0];
      return `Top pick: ${top.s.name}. Score: ${top.r.score}/100. ${top.r.riskFree ? "Risk-Free zone. " : ""}${top.r.recommendation}`;
    }
    return "Ask about a specific startup on its page, or browse Startups for AI analysis. Key: check valuation, revenue, burn rate, and AI risk score.";
  }

  if (role === "startup") {
    if (q.includes("pitch") || q.includes("improve")) return "Focus on: clear problem, traction (revenue, users), unit economics, and use of funds. Add metrics, documents, and update regularly.";
    if (q.includes("valuation")) return "Valuation should align with revenue multiples, comparable deals, and growth stage. Add financials and let AI score guide you.";
    if (q.includes("attract")) return "Complete your profile: documents, revenue, growth metrics. Get admin approval. AI analysis helps investors trust your data.";
    return "Ensure documents, metrics, and description are complete. Admin approval required. Use AI analysis on your startup page to see investor view.";
  }

  if (role === "bank") {
    const loans = store.loans.getAll().filter((l) => l.status === "pending");
    if (loans.length && (q.includes("loan") || q.includes("risk") || q.includes("approval"))) {
      const loan = loans[0];
      const startup = store.startups.get(loan.startupId);
      return answerBankAIQuestion(q, loan, startup ?? undefined);
    }
    if (q.includes("low risk") || q.includes("which")) {
      if (loans.length === 0) return "No pending loans.";
      const withStartup = loans.map((l) => ({ loan: l, s: store.startups.get(l.startupId) })).filter((x) => x.s);
      const best = withStartup.filter((x) => x.s && x.s.revenue >= x.loan.amount)[0];
      return best ? `Lowest risk: ${best.loan.startupName}. Revenue covers loan. Review in Loan Requests.` : "Review each loan's revenue vs amount. Use AI on each request.";
    }
    return "Go to Loan Requests, expand a request, use AI Loan Analyst for risk and approval recommendations.";
  }

  if (role === "admin") {
    if (q.includes("health") || q.includes("overview")) {
      const approved = startups.length;
      const pending = store.startups.getAll().filter((s) => s.status === "pending").length;
      const inv = store.investments.getAll();
      const total = inv.reduce((s, i) => s + i.amount, 0);
      return `Platform: ${approved} approved, ${pending} pending startups. ${inv.length} investments (${formatINR(total)}). ${store.loans.getAll().length} loans.`;
    }
    if (q.includes("high-risk") || q.includes("risk")) {
      const withReport = startups.map((s) => ({ s, r: analyzeStartup(s) })).filter((x) => x.r.riskScore < 50);
      return withReport.length ? `High-risk: ${withReport.map((x) => x.s.name).join(", ")}. Review documents before issues.` : "No high-risk approved startups.";
    }
    return "Use expandable startup cards to review documents before approve/reject. Check Platform Overview for stats.";
  }

  return "Ask a question relevant to your role.";
}

interface DashboardAIProps {
  role: UserRole;
}

export default function DashboardAI({ role }: DashboardAIProps) {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setInput("");
    setMessages((m) => [...m, { role: "user" as const, text: t }]);
    const reply = getAIResponse(t, role);
    setMessages((m) => [...m, { role: "ai" as const, text: reply }]);
  };

  const quick = QUICK_BY_ROLE[role] || QUICK_BY_ROLE.investor;

  return (
    <div className="flex h-full min-h-[320px] flex-col rounded-xl border border-slate-700 bg-slate-800/50">
      <div className="border-b border-slate-700 px-4 py-3">
        <h3 className="font-semibold text-white">AI Assistant — Invest or Not?</h3>
        <p className="text-xs text-slate-400">Ask anything. Get recommendations.</p>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div>
            <p className="mb-2 text-sm text-slate-400">Try:</p>
            <div className="flex flex-wrap gap-2">
              {quick.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="rounded-full border border-slate-600 bg-slate-700/50 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-600"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[90%] rounded-lg px-3 py-2 text-sm ${
                  m.role === "user" ? "bg-emerald-600/30" : "bg-slate-700/50 text-slate-200"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-slate-700 p-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask AI..."
            className="flex-1 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white"
          />
          <button
            onClick={() => send(input)}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
