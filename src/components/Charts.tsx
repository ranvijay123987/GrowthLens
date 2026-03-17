"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { formatINR } from "@/lib/utils";
import type { Startup } from "@/lib/types";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export function RevenueChart({ startup }: { startup: Startup }) {
  const data =
    startup.revenueHistory?.length > 0
      ? startup.revenueHistory
      : [
          { month: "Jan", value: startup.revenue * 0.6 },
          { month: "Feb", value: startup.revenue * 0.8 },
          { month: "Mar", value: startup.revenue },
          { month: "Apr", value: startup.revenue * 1.1 },
        ];
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
        <YAxis stroke="#94a3b8" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} fontSize={12} />
        <Tooltip
          formatter={(v: number) => [formatINR(v), "Revenue"]}
          contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
        />
        <Area type="monotone" dataKey="value" stroke="#10b981" fill="url(#revenueGrad)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function BurnVsRevenueChart({ startup }: { startup: Startup }) {
  const data = [
    { name: "Revenue", value: startup.revenue || 1, fill: "#10b981" },
    { name: "Burn Rate", value: startup.burnRate || 0, fill: "#ef4444" },
  ];
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis type="number" stroke="#94a3b8" tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
        <YAxis type="category" dataKey="name" stroke="#94a3b8" width={80} />
        <Tooltip
          formatter={(v: number) => formatINR(v)}
          contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MetricsPieChart({ startup }: { startup: Startup }) {
  const data = [
    { name: "Revenue", value: startup.revenue || 0, fill: "#10b981" },
    { name: "Turnover", value: startup.turnover || 0, fill: "#3b82f6" },
    { name: "Burn", value: startup.burnRate || 0, fill: "#ef4444" },
    { name: "Seeking", value: startup.investmentRequired || 0, fill: "#f59e0b" },
  ].filter((d) => d.value > 0);
  if (data.length === 0) data.push({ name: "Revenue", value: 1, fill: "#334155" });
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={70}
          paddingAngle={2}
          dataKey="value"
          label={({ name }) => name}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={data[i].fill} />
          ))}
        </Pie>
        <Tooltip
          formatter={(v: number) => formatINR(v)}
          contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}


export function PortfolioChart({ data }: { data: { name: string; value: number }[] }) {
  if (data.length === 0) return null;
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis type="number" stroke="#94a3b8" tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
        <YAxis type="category" dataKey="name" stroke="#94a3b8" width={70} tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(v: number) => formatINR(v)}
          contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
        />
        <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
