"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { User, UserRole } from "@/lib/types";
import { store } from "@/lib/store";

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (email: string, password: string, name: string, role: UserRole) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setUser(store.currentUser.get());
    setMounted(true);
  }, []);

  const login = (email: string, password: string) => {
    const u = store.users.findByEmail(email);
    if (!u || u.password !== password) return false;
    store.currentUser.set(u);
    setUser(u);
    return true;
  };

  const signup = (email: string, password: string, name: string, role: UserRole) => {
    if (store.users.findByEmail(email)) return false;
    const u: User = {
      id: crypto.randomUUID(),
      email,
      name,
      role,
      password,
    };
    store.users.add(u);
    store.currentUser.set(u);
    setUser(u);
    return true;
  };

  const logout = () => {
    store.currentUser.set(null);
    setUser(null);
  };

  if (!mounted) return null;

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
