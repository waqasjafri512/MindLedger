# 🏛️ MindLedger (Production Edition)

> "Reasoning must be captured before the outcome is known."

MindLedger is a world-class **Decision Intelligence Platform** designed to audit and improve your cognitive architecture. Unlike traditional note-taking apps, MindLedger is a "Thought Ledger" that maps your decision-making patterns, forcing you to articulate your reasoning before learning the outcome, thereby eliminating *hindsight bias*.

---

## 🌟 Key Features

### 1. The Decision Reckoning (Wizard)
A premium multi-step wizard to time-lock your reasoning:
- **Context & Situation**: Log precisely what is happening in the moment.
- **Reasoning Architecture**: Document why you are making this choice and what alternatives you rejected.
- **Calibration Slider**: Dial in your confidence level (0-100%).
- **AI Intelligence Flash**: Generate an instant bias-detection report using **Groq (Llama 3.3)**.
- **The Sealing**: Lock the ledger until the outcome is revealed at the review date.

### 2. Cognitive DNA (Bias Profile)
Your entire decision history is aggregated into a holistic **Bias Profile**. The platform's AI engine analyzes all of your case files to extract recurring cognitive blindspots (e.g., Optimism Bias, Sunk Cost Fallacy) and highlights your strongest assets.

### 3. Intelligence Tiers (Monetization)
A fully integrated **Stripe Subscription** model with three tiers:
- **Free (Standard)**: 5 Total Ledger Entries limit. Standard AI metadata.
- **Pro ($19/mo)**: Unlimited entries, advanced profiling, prioritized AI access.
- **Team ($49/mo)**: Collective case files and organizational risk analysis.

### 4. Security-First Architecture
Transformed from a prototype to a secure, hardened application:
- **IDOR Protection**: All data queries are strictly scoped to the authenticated `userId`.
- **Zod Validation**: Strict schema validation for all API inputs.
- **Rate Limiting**: Tiered protection for authentication, AI analysis, and standard API routes.
- **Secrets Management**: Hardened cookie-based JWT authentication with HttpOnly/Secure flags.

---

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS v4, Shadcn UI, Framer Motion, TypeScript.
- **Backend**: Node.js, Express.js, Prisma ORM, PostgreSQL.
- **Intelligence Layer**: Meta LLaMA 3.3 (70B) powered over **Groq** for ultra-fast, zero-latency inference.
- **Payments**: **Stripe** (Checkout & Webhooks).
- **Authentication**: JWT & Secure Cookie-based sessions.

---

## 🛠️ Installation & Setup

### Requirements
- Node.js (v20+)
- PostgreSQL Database
- [Groq Cloud API Key](https://console.groq.com/)
- [Stripe Account](https://stripe.com/) (for subscription features)

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd MindLedger

# Install Frontend
cd frontend
npm install

# Install Backend
cd ../backend
npm install
```

### 2. Configure Environment Variables
You need `.env` files in both the frontend and backend directories.

**Backend (`backend/.env`):**
```env
PORT=4000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
DATABASE_URL="postgresql://user:pass@localhost:5432/MindLedger"
GROQ_API_KEY="gsk_your_groq_api_key_here"
JWT_SECRET="your_highly_secure_long_random_string"

# Stripe Config
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRO_PLAN_ID="price_..."
STRIPE_TEAM_PLAN_ID="price_..."
```

**Frontend (`frontend/.env.local`):**
```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
```

### 3. Database Initialization
```bash
cd backend
npx prisma db push
npx prisma generate
```

### 4. Running the Application
**Start the Backend API:**
```bash
cd backend
npm start
```

**Start the Frontend Client (in a separate terminal):**
```bash
cd frontend
npm run dev
```

The portal will be accessible at `http://localhost:3000`.

---

**MindLedger** — *Audit Your Mind. Calibrate Your Future.*
