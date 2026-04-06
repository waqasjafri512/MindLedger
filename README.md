# 🏛️ MindLedger (Elite Edition)

> "Reasoning must be captured before the outcome is known."

MindLedger is a world-class **Decision Intelligence Platform** designed to audit and improve your cognitive architecture. Unlike traditional note-taking apps, MindLedger is a "Thought Ledger" that maps your decision-making patterns, forcing you to articulate your reasoning before learning the outcome, thereby eliminating *hindsight bias*.

---

## 🌟 Key Features

### 1. The Decision Reckoning
A 5-step wizard to time-lock your reasoning:
- **Context & Situation**: Log precisely what is happening.
- **Reasoning Architecture**: Document why you are making this choice and what alternatives you rejected.
- **Calibration Slider**: Dial in your confidence level (0-100%).
- **AI Intelligence Flash**: Generate an instant bias-detection report.
- **The Sealing**: Lock the ledger until the outcome is revealed at the review date.

### 2. Cognitive DNA (Bias Profile)
Your entire decision history is aggregated into a holistic **Bias Profile**. The platform's AI engine analyzes all of your case files to extract recurring cognitive blindspots (e.g., Optimism Bias, Sunk Cost Fallacy) and highlights your strongest domains.

### 3. Hindsight Reconciliation
When a decision's review date arrives, MindLedger guides you through a reconciliation process. Compare your initial time-locked confidence with the actual outcome to generate an **Accuracy Score** and a key learning for the future.

### 4. Elite UI/UX & Soft Archival
- **White & Gold Aesthetic**: Designed as a high-fidelity, luxury portal using Framer Motion and modern glassmorphism.
- **Soft Delete System**: Curate your active Dashboard by archiving older cases. Hidden from view, yet preserved in the database to maintain the integrity of your long-term Cognitive DNA.

---

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS v4, Shadcn UI, Framer Motion, TypeScript.
- **Backend**: Node.js, Express.js, Prisma ORM, PostgreSQL.
- **Intelligence Layer**: Meta LLaMA 3.3 (70B) powered over Groq via Native Fetch API (for ultra-fast, zero-dependency token streaming).
- **Authentication**: JWT & HttpOnly Secure Cookies.

---

## 🛠️ Installation & Setup

### Requirements
- Node.js (v20+)
- PostgreSQL Database
- Groq Cloud API Key (`gsk_...`)

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
DATABASE_URL="postgresql://user:pass@localhost:5432/MindLedger"
XAI_API_KEY="gsk_your_groq_api_key_here"
JWT_SECRET="your_highly_secure_secret"
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
npm run build
npm start
```

**Start the Frontend Client (in a separate terminal):**
```bash
cd frontend
npm run dev
```

The portal will be accessible at `http://localhost:3000`.

---

## 🧠 The Intelligence Engine (Native API)
MindLedger relies on a specialized prompt architecture wrapped in a highly stable Native Fetch request to the Groq Chat Completions API. It specifically leverages the `llama-3.3-70b-versatile` model to ensure millisecond-latency intelligence audits without heavy SDK wrappers.

---

**MindLedger Elite** — *Audit Your Mind. Calibrate Your Future.*
