# GrowthLens AI

AI-powered startup investment platform. Investors analyze startups, chat with founders, and invest. Startups register, add metrics, apply for loans. Banks approve/reject loans. All amounts in **₹ Indian Rupees**.

## Features

- **4 Roles**: Investor, Startup Owner, Bank, Admin
- **Investor**: Browse startups → View details → AI Analysis → Ask AI → Chat with founder → Invest
- **Startup Owner**: Register startup, add metrics (revenue, turnover, valuation, etc.), apply for loans
- **Bank**: View loan requests, approve or reject
- **Admin**: Approve startups, manage users, platform analytics

## Setup

1. **Install Node.js** (v18+) from https://nodejs.org
2. Install dependencies:
   ```bash
   cd growthlens-ai
   npm install
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000

## Demo Flow

1. **Sign Up** as Startup Owner → Register a startup → Add business metrics (Admin must approve first)
2. **Sign Up** as Admin → Approve the startup
3. **Sign Up** as Investor → Browse startups → Click startup → Analyze with AI → Ask AI → Invest
4. **Sign Up** as Bank → See loan requests from startups → Approve/Reject

## Tech Stack

- Next.js 14, React, TypeScript
- Tailwind CSS
- Recharts
- localStorage for data (no backend required for demo)
