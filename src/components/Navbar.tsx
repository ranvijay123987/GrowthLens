"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const LINKS: Record<string, { href: string; label: string }[]> = {
  investor: [
    { href: "/investor", label: "Dashboard" },
    { href: "/startups", label: "Startups" },
  ],
  startup: [
    { href: "/startup", label: "Dashboard" },
    { href: "/startups", label: "Browse" },
  ],
  bank: [{ href: "/bank", label: "Loan Requests" }],
  admin: [
    { href: "/admin", label: "Admin" },
    { href: "/startups", label: "Startups" },
  ],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const links = user ? LINKS[user.role] ?? [] : [];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href={user ? `/${user.role}` : "/"} className="text-xl font-bold text-emerald-400">
          GrowthLens AI
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/legal" className="text-sm text-slate-500 hover:text-slate-300">
            Legal
          </Link>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm ${
                pathname === l.href ? "text-emerald-400" : "text-slate-400 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {user && (
            <>
              <span className="text-sm text-slate-500">{user.name} ({user.role})</span>
              <button
                onClick={handleLogout}
                className="rounded bg-slate-800 px-3 py-1 text-sm text-slate-300 hover:bg-slate-700"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
