"use client";

import { useState, useRef, useEffect } from "react";
import { answerBankAIQuestion, BANK_QUICK_REPLIES } from "@/lib/ai";
import type { LoanRequest } from "@/lib/types";
import type { Startup } from "@/lib/types";

interface BankAIChatbotProps {
  loan: LoanRequest;
  startup?: Startup | null;
  className?: string;
}

interface ChatEntry {
  role: "user" | "ai";
  text: string;
}

export default function BankAIChatbot({ loan, startup, className = "" }: BankAIChatbotProps) {
  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: t }]);
    const reply = answerBankAIQuestion(
      t,
      { amount: loan.amount, revenue: loan.revenue, turnover: loan.turnover, purpose: loan.purpose },
      startup ?? undefined
    );
    setMessages((m) => [...m, { role: "ai", text: reply }]);
  };

  return (
    <div className={`flex flex-col rounded-xl border border-slate-700 bg-slate-800/50 ${className}`}>
      <div className="border-b border-slate-700 px-4 py-3">
        <h3 className="font-semibold text-white">AI Loan Analyst</h3>
        <p className="text-xs text-slate-400">Ask about loan risk & approval</p>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4 max-h-72 min-h-48">
        {messages.length === 0 ? (
          <div>
            <p className="mb-3 text-sm text-slate-400">
              Try: &quot;Should we approve?&quot; or &quot;Loan risk?&quot;
            </p>
            <div className="flex flex-wrap gap-2">
              {BANK_QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="rounded-full border border-slate-600 bg-slate-700/50 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-600 hover:text-white"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  m.role === "user"
                    ? "bg-blue-600/30 text-blue-100"
                    : "bg-slate-700/50 text-slate-200"
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
            placeholder="Ask AI about this loan..."
            className="flex-1 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500"
          />
          <button
            onClick={() => send(input)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
