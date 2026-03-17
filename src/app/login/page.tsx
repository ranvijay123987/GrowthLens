"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { store } from "@/lib/store";

const DASHBOARD: Record<string, string> = {
  investor: "/investor",
  startup: "/startup",
  bank: "/bank",
  admin: "/admin",
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Enter email and password");
      return;
    }
    const ok = login(email, password);
    if (!ok) {
      setError("Invalid email or password");
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
        <h1 className="mb-6 text-2xl font-bold text-white">Login</h1>
        {error && (
          <div className="mb-4 rounded bg-red-900/50 p-3 text-red-300">{error}</div>
        )}
        <div className="mb-4">
          <label className="mb-1 block text-sm text-slate-400">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white"
          />
        </div>
        <div className="mb-6">
          <label className="mb-1 block text-sm text-slate-400">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-emerald-600 py-2 font-semibold text-white hover:bg-emerald-500"
        >
          Login
        </button>
        <p className="mt-4 text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-emerald-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
