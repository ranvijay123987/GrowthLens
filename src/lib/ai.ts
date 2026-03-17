import type { Startup, AIReport } from "./types";

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
}

export function analyzeStartup(startup: Startup): AIReport {
  let score = 50;
  if (startup.revenue > 0) score += Math.min(15, (startup.revenue / 1000000) * 2);
  if (startup.profitMargin > 0) score += Math.min(15, startup.profitMargin);
  if (startup.customerGrowth > 0) score += Math.min(10, startup.customerGrowth);
  if (startup.burnRate > 0 && startup.revenue > 0)
    score -= Math.min(15, (startup.burnRate / startup.revenue) * 50);
  score = Math.max(0, Math.min(100, Math.round(score)));

  const riskFactors: string[] = [];
  let riskScore = 70;

  if (startup.burnRate > startup.revenue && startup.revenue > 0) {
    riskFactors.push("Burn rate exceeds revenue — runway risk");
    riskScore -= 25;
  }
  if (startup.profitMargin < 0) {
    riskFactors.push("Negative profit margin");
    riskScore -= 15;
  }
  if (startup.customerGrowth < 5 && startup.customerGrowth > 0) {
    riskFactors.push("Low customer growth rate");
    riskScore -= 10;
  }
  if (startup.revenue === 0) {
    riskFactors.push("No revenue yet — pre-revenue stage");
    riskScore -= 20;
  }
  if (startup.profitMargin > 15 && startup.revenue > 0) {
    riskFactors.push("Healthy profit margin");
    riskScore += 10;
  }
  if (startup.customerGrowth > 20) {
    riskFactors.push("Strong customer growth");
    riskScore += 10;
  }
  if (startup.revenue > 0 && startup.burnRate < startup.revenue * 0.5) {
    riskFactors.push("Revenue covers burn comfortably");
    riskScore += 15;
  }

  riskScore = Math.max(0, Math.min(100, riskScore));

  const riskFree = riskScore >= 75 && score >= 70;

  let riskLevel: "low" | "medium" | "high" = "medium";
  if (riskScore >= 70) riskLevel = "low";
  else if (riskScore < 45) riskLevel = "high";

  let growthPrediction = "Moderate growth expected.";
  if (startup.customerGrowth > 20 && startup.revenue > 0)
    growthPrediction =
      "Strong growth trajectory based on customer acquisition and revenue. AI projects 25-40% YoY growth potential.";
  else if (startup.burnRate > startup.revenue && startup.revenue > 0)
    growthPrediction =
      "Growth dependent on reducing burn rate and increasing revenue. Focus on unit economics before scaling.";
  else if (startup.profitMargin > 10)
    growthPrediction =
      "Profitable with room to scale. AI suggests sustainable 15-25% growth with current model.";

  let recommendation = "Consider further due diligence.";
  if (riskFree)
    recommendation =
      "AI Analysis: Risk-free investment zone. Strong fundamentals, healthy margins, and growth trajectory. Recommended for portfolio.";
  else if (score >= 75)
    recommendation =
      "Good investment opportunity. Strong fundamentals. Low-risk profile. Suitable for conservative investors.";
  else if (score >= 60)
    recommendation =
      "Moderate opportunity. Review risk factors above. Consider for balanced portfolio allocation.";
  else
    recommendation =
      "Higher risk profile. AI advises caution. Suitable only for risk-tolerant investors with proper diversification.";

  return {
    score,
    riskLevel,
    riskScore,
    riskFree,
    riskFactors,
    growthPrediction,
    recommendation,
  };
}

const QUICK_REPLIES = [
  "Is this startup risk-free?",
  "What are the main risks?",
  "Should I invest?",
  "Is it profitable?",
  "How is the growth?",
  "What's the valuation?",
];

export function answerAIQuestion(
  question: string,
  startup: Startup,
  report: AIReport | null
): string {
  const q = question.toLowerCase();
  const s = startup;
  const r = report ?? analyzeStartup(startup);

  if (
    q.includes("risk-free") ||
    q.includes("risk free") ||
    q.includes("safe") ||
    q.includes("secure")
  ) {
    if (r.riskFree)
      return `Yes. Our AI analysis marks this as a **risk-free zone** investment. Risk Score: ${r.riskScore}/100. Strong fundamentals, healthy margins, and sustainable growth. Suitable for conservative investors.`;
    return `Not fully risk-free. AI Risk Score: ${r.riskScore}/100 (${r.riskLevel} risk). Key factors: ${r.riskFactors.slice(0, 2).join("; ")}. Review the full AI report for details.`;
  }
  if (q.includes("risk") || q.includes("risky"))
    return `Risk Level: ${r.riskLevel}. Risk Score: ${r.riskScore}/100. Factors: ${r.riskFactors.join(". ")}`;
  if (q.includes("profitable") || q.includes("profit"))
    return s.profitMargin > 0
      ? `Yes. Profit margin: ${s.profitMargin}%. Revenue: ₹${formatINR(s.revenue)}, Turnover: ₹${formatINR(s.turnover)}.`
      : "Not yet profitable. Pre-revenue or early stage. Monitor burn rate and runway.";
  if (q.includes("valuation"))
    return `Valuation: ₹${formatINR(s.valuation)}. Seeking ₹${formatINR(s.investmentRequired)} for ${s.equityOffered}% equity in ${s.fundingRound}.`;
  if (q.includes("growth") || q.includes("grow"))
    return `Customer growth: ${s.customerGrowth}%. ${r.growthPrediction}`;
  if (q.includes("invest") || q.includes("should i"))
    return `${r.recommendation} Investment score: ${r.score}/100.`;
  if (q.includes("burn") || q.includes("runway"))
    return `Burn rate: ₹${formatINR(s.burnRate)}/mo. Revenue: ₹${formatINR(s.revenue)}. ${
      s.revenue > 0 && s.burnRate < s.revenue
        ? "Revenue covers burn — healthy runway."
        : "Elevated burn relative to revenue."
    }`;
  if (q.includes("equity") || q.includes("share"))
    return `Offering ${s.equityOffered}% equity. Investment required: ₹${formatINR(s.investmentRequired)}. Use the calculator to see your equity for any amount.`;

  return `Based on AI analysis: Score ${r.score}/100, Risk ${r.riskScore}/100. ${r.recommendation} Revenue: ₹${formatINR(s.revenue)}, Turnover: ₹${formatINR(s.turnover)}, Profit Margin ${s.profitMargin}%. Ask "Is this risk-free?" or "Should I invest?" for more.`;
}

export { QUICK_REPLIES };

const BANK_QUICK_REPLIES = [
  "Should we approve this loan?",
  "What's the loan risk?",
  "Is the startup creditworthy?",
  "Revenue vs loan amount?",
  "What are the risk factors?",
  "Recommend approval?",
];

export function answerBankAIQuestion(
  question: string,
  loan: { amount: number; revenue: number; turnover: number; purpose: string },
  startup?: { valuation: number; profitMargin: number; burnRate: number; customerGrowth: number }
): string {
  const q = question.toLowerCase();
  const s = startup ?? {
    valuation: 0,
    profitMargin: 0,
    burnRate: 0,
    customerGrowth: 0,
  };
  const debtToRevenue = loan.revenue > 0 ? loan.amount / loan.revenue : 999;
  const debtToTurnover = loan.turnover > 0 ? loan.amount / loan.turnover : 999;

  if (q.includes("approve") || q.includes("approval") || q.includes("recommend")) {
    if (debtToRevenue < 1 && loan.revenue > 0)
      return `AI recommends consideration for approval. Loan is ${(debtToRevenue * 100).toFixed(0)}% of revenue — manageable. Revenue and turnover support repayment capacity. Conduct credit check.`;
    if (debtToRevenue > 2)
      return `AI advises caution. Loan is ${(debtToRevenue * 100).toFixed(0)}% of revenue — high exposure. Request collateral or reduce amount.`;
    return `Moderate risk. Loan ${formatINR(loan.amount)} vs Revenue ${formatINR(loan.revenue)}. Review purpose: "${loan.purpose}". Recommend further due diligence.`;
  }
  if (q.includes("risk") || q.includes("risky")) {
    const risks: string[] = [];
    if (debtToRevenue > 1) risks.push("Loan exceeds annual revenue");
    if (loan.revenue === 0) risks.push("No revenue — high default risk");
    if (s.burnRate > s.valuation && s.valuation > 0) risks.push("High burn rate");
    if (risks.length === 0) risks.push("Moderate risk; revenue supports loan");
    return `Loan Risk: ${risks.join(". ")}. Debt/Revenue: ${(debtToRevenue * 100).toFixed(0)}%.`;
  }
  if (q.includes("creditworthy") || q.includes("credit")) {
    const score = loan.revenue >= loan.amount * 2 ? "Good" : loan.revenue >= loan.amount ? "Moderate" : "Weak";
    return `Creditworthiness: ${score}. Revenue: ₹${formatINR(loan.revenue)}, Turnover: ₹${formatINR(loan.turnover)}. ${score === "Good" ? "Strong repayment capacity." : "Request additional security."}`;
  }
  if (q.includes("revenue") || q.includes("amount")) {
    return `Loan: ₹${formatINR(loan.amount)}. Revenue: ₹${formatINR(loan.revenue)}. Ratio: ${(debtToRevenue * 100).toFixed(0)}% of revenue. Turnover: ₹${formatINR(loan.turnover)}.`;
  }
  if (q.includes("factor")) {
    return `Risk factors: (1) Debt/Revenue ratio ${(debtToRevenue * 100).toFixed(0)}%, (2) Profit margin ${s.profitMargin}%, (3) Burn rate ₹${formatINR(s.burnRate)}, (4) Customer growth ${s.customerGrowth}%. Purpose: ${loan.purpose}.`;
  }
  return `Loan analysis: ₹${formatINR(loan.amount)} requested. Revenue: ₹${formatINR(loan.revenue)}, Turnover: ₹${formatINR(loan.turnover)}. Debt/Revenue: ${(debtToRevenue * 100).toFixed(0)}%. Ask "Should we approve?" for recommendation.`;
}

export { BANK_QUICK_REPLIES };
