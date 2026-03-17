export type UserRole = "investor" | "startup" | "bank" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password?: string;
}

export interface Startup {
  id: string;
  name: string;
  image?: string; // URL or use placeholder
  industry: string;
  description: string;
  founderName: string;
  ownerId: string;
  status: "pending" | "approved" | "rejected";
  valuation: number;
  fundingRound: string;
  investmentRequired: number;
  equityOffered: number;
  revenue: number;
  turnover: number;
  profitMargin: number;
  burnRate: number;
  customerGrowth: number;
  fundingRaised: number;
  revenueHistory: { month: string; value: number }[];
  documents?: { name: string; url?: string; description?: string }[];
  createdAt: string;
}

export interface Investment {
  id: string;
  startupId: string;
  investorId: string;
  amount: number;
  equity: number;
  createdAt: string;
}

export interface LoanRequest {
  id: string;
  startupId: string;
  startupName: string;
  amount: number;
  purpose: string;
  status: "pending" | "approved" | "rejected";
  revenue: number;
  turnover: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

export interface AIReport {
  score: number;
  riskLevel: "low" | "medium" | "high";
  riskScore: number; // 0-100, higher = lower risk
  riskFree: boolean;
  riskFactors: string[];
  growthPrediction: string;
  recommendation: string;
}
