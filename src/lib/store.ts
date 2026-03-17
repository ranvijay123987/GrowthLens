import type { User, Startup, Investment, LoanRequest, ChatMessage } from "./types";

const STORAGE_KEYS = {
  users: "growthlens_users",
  startups: "growthlens_startups",
  investments: "growthlens_investments",
  loans: "growthlens_loans",
  chats: "growthlens_chats",
  currentUser: "growthlens_current",
};

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

export const store = {
  users: {
    getAll: (): User[] => load(STORAGE_KEYS.users, []),
    save: (users: User[]) => save(STORAGE_KEYS.users, users),
    add: (user: User) => {
      const users = store.users.getAll();
      users.push(user);
      store.users.save(users);
    },
    findByEmail: (email: string) => store.users.getAll().find((u) => u.email === email),
    get: (id: string) => store.users.getAll().find((u) => u.id === id),
  },
  currentUser: {
    get: (): User | null => load(STORAGE_KEYS.currentUser, null),
    set: (user: User | null) => save(STORAGE_KEYS.currentUser, user),
  },
  startups: {
    getAll: (): Startup[] => load(STORAGE_KEYS.startups, []),
    getApproved: () => store.startups.getAll().filter((s) => s.status === "approved"),
    save: (startups: Startup[]) => save(STORAGE_KEYS.startups, startups),
    add: (s: Startup) => {
      const list = store.startups.getAll();
      list.push(s);
      store.startups.save(list);
      return s;
    },
    update: (id: string, upd: Partial<Startup>) => {
      const list = store.startups.getAll();
      const i = list.findIndex((s) => s.id === id);
      if (i >= 0) list[i] = { ...list[i], ...upd };
      store.startups.save(list);
    },
    get: (id: string) => store.startups.getAll().find((s) => s.id === id),
  },
  investments: {
    getAll: (): Investment[] => load(STORAGE_KEYS.investments, []),
    save: (data: Investment[]) => save(STORAGE_KEYS.investments, data),
    add: (inv: Investment) => {
      const list = store.investments.getAll();
      list.push(inv);
      store.investments.save(list);
    },
    byInvestor: (id: string) => store.investments.getAll().filter((i) => i.investorId === id),
  },
  loans: {
    getAll: (): LoanRequest[] => load(STORAGE_KEYS.loans, []),
    save: (data: LoanRequest[]) => save(STORAGE_KEYS.loans, data),
    add: (loan: LoanRequest) => {
      const list = store.loans.getAll();
      list.push(loan);
      store.loans.save(list);
    },
    update: (id: string, status: "approved" | "rejected") => {
      const list = store.loans.getAll();
      const i = list.findIndex((l) => l.id === id);
      if (i >= 0) list[i] = { ...list[i], status };
      store.loans.save(list);
    },
  },
  chats: {
    getAll: (): ChatMessage[] => load(STORAGE_KEYS.chats, []),
    save: (data: ChatMessage[]) => save(STORAGE_KEYS.chats, data),
    add: (msg: ChatMessage) => {
      const list = store.chats.getAll();
      list.push(msg);
      store.chats.save(list);
    },
    between: (a: string, b: string) =>
      store.chats
        .getAll()
        .filter((m) => (m.senderId === a && m.receiverId === b) || (m.senderId === b && m.receiverId === a))
        .sort((x, y) => new Date(x.timestamp).getTime() - new Date(y.timestamp).getTime()),
    involving: (userId: string) =>
      store.chats
        .getAll()
        .filter((m) => m.senderId === userId || m.receiverId === userId)
        .sort((x, y) => new Date(x.timestamp).getTime() - new Date(y.timestamp).getTime()),
  },
};
