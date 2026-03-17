"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { store } from "@/lib/store";
import type { UserRole } from "@/lib/types";

const ROLES: { value: UserRole; label: string }[] = [
  { value: "investor", label: "Investor" },
  { value: "startup", label: "Startup Owner" },
  { value: "bank", label: "Bank" },
  { value: "admin", label: "Admin" },
];

const DASHBOARD: Record<string, string> = {
  investor: "/investor",
  startup: "/startup",
  bank: "/bank",
  admin: "/admin",
};

export default function SignupPage() {
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get("role") as UserRole) || "investor";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password || !name) {
      setError("Fill all fields");
      return;
    }
    const ok = signup(email, password, name, role);
    if (!ok) {
      setError("Email already registered");
      return;
    }
    const u = store.currentUser.get();
    router.push(DASHBOARD[u?.role ?? "investor"] ?? "/investor");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900/80 p-8"
      >
        <h1 className="mb-6 text-2xl font-bold text-white">Sign Up</h1>
        {error && (
          <div className="mb-4 rounded bg-red-900/50 p-3 text-red-300">{error}</div>
        )}
        <div className="mb-4">
          <label className="mb-1 block text-sm text-slate-400">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 block text-sm text-slate-400">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 block text-sm text-slate-400">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white"
          />
        </div>
        <div className="mb-6">
          <label className="mb-1 block text-sm text-slate-400">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-emerald-600 py-2 font-semibold text-white hover:bg-emerald-500"
        >
          Sign Up
        </button>
        <p className="mt-4 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
