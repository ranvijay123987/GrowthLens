# GrowthLens AI — Intelligent Startup Investment & Solvency Analytics

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.12-22c55e?style=flat)](https://recharts.org/)

**GrowthLens AI** is a multi-role startup investment intelligence platform built with Next.js 14 and TypeScript. It bridges the transparency gap between early-stage startups, angel investors, banking institutions, and compliance administrators by providing algorithmic solvency checks, automated runway analysis, interactive financial telemetry, and contextual AI advisory.

---

## 🌟 Key Features

### 1. Granular Role-Based Access Control (RBAC)
- **Investor**: Search curated startups, view financial disclosures, run AI health audits, chat with founders, and allocate simulated capital.
- **Startup Founder**: Onboard verified venture profiles, report quarterly metrics (revenue, burn rate, valuation, turnover), and apply for non-dilutive credit lines.
- **Banking Partners**: Review enterprise loan applications, assess risk-weighted asset metrics, and approve/reject underwriting requests.
- **Platform Admin**: Supervise marketplace listings, approve startup onboardings, and monitor platform-wide investment volume.

### 2. Algorithmic Due Diligence & Solvency Scoring
- **Automated Solvency Score (0-100)**: Evaluates burn-to-revenue ratio, net margin trajectory, and customer acquisition velocity.
- **Risk Indicator Tagging**: Flags runway risks, negative operating margins, and high leverage flags before investor capital commitment.
- **Interactive Visual Telemetry**: High-resolution financial charting via **Recharts** for burn-down analysis, revenue growth vs. overhead, and valuation benchmarks.

### 3. Contextual AI Investment Analyst
- Embedded conversational assistant for due diligence inquiries.
- Real-time answers on runway projections, margin sustainability, and valuation sanity checks.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Lucide React Icons
- **Data Visualization**: Recharts
- **State Architecture**: Client-Side Persistent Reactive Store (Local Cache)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn

### Installation
`ash
# Clone repository
git clone https://github.com/ranvijay123987/GrowthLens.git
cd GrowthLens

# Install dependencies
npm install

# Start development server
npm run dev
`

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📊 Evaluation Flow for Reviewers

1. **Sign Up as Founder**: Submit a startup listing with revenue and monthly burn metrics.
2. **Switch to Admin**: Navigate to /admin to verify and approve the listing.
3. **Switch to Investor**: Explore the startup directory, launch the **AI Investment Analyst**, review the financial health scorecard, and execute a simulated pledge.
4. **Switch to Bank**: Review pending loan underwriting requests under /bank.

---

## 📄 License
MIT License. Created by [Ranvijay Sharma](https://github.com/ranvijay123987).