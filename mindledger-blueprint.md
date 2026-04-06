# MindLedger — Full Technical Blueprint

> **Version:** 1.0 | **Stack:** Next.js 14 · Supabase · Claude API · Stripe · Vercel

## 1. Project Overview

MindLedger is a Decision Intelligence Platform. This version uses a decoupled architecture to separate concerns, utilizing a Node.js/Express backend for logic and a Next.js 14+ frontend for the UI.

---

## 2. Tech Stack (Updated)

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js 14+ (App Router) | SSR, React Server Components, fast UI |
| Backend | Node.js + Express | Dedicated logic layer, scalable |
| Database | PostgreSQL + Prisma ORM | Strong consistency, type-safe data access |
| AI | Grok API (xAI) | Cost-effective during development |
| Auth | JWT (JSON Web Tokens) | Custom auth for the separate backend |
| Deployment | Vercel (Frontend) + Render/Heroku (Backend) | Standard hosting paths |
rrors + usage |

---

## 3. Database Schema (Supabase / PostgreSQL)

```sql
-- Users (extended Supabase auth.users)
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name  TEXT,
  plan          TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'team')),
  stripe_id     TEXT UNIQUE,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Decision entries (core model)
CREATE TABLE decisions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title           TEXT NOT NULL,
  category        TEXT CHECK (category IN ('career', 'finance', 'relationship', 'health', 'other')),
  context         TEXT NOT NULL,          -- What situation led to this decision?
  reasoning       TEXT NOT NULL,          -- Why are you making this choice?
  alternatives    JSONB DEFAULT '[]',     -- [{option: string, rejected_reason: string}]
  confidence      INT CHECK (confidence BETWEEN 0 AND 100),
  emotion_tags    TEXT[] DEFAULT '{}',    -- ['excited', 'anxious', 'calm']
  review_date     DATE NOT NULL,
  is_locked       BOOLEAN DEFAULT true,   -- Cannot edit after submission
  reviewed_at     TIMESTAMPTZ,
  outcome         TEXT,                   -- User fills in at review time
  outcome_rating  INT CHECK (outcome_rating BETWEEN 1 AND 5),
  hindsight_notes TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- AI bias analyses (generated after reviews)
CREATE TABLE bias_analyses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  generated_at  TIMESTAMPTZ DEFAULT now(),
  decisions_analyzed INT,
  biases        JSONB NOT NULL,  -- [{name, severity, score, examples, insight}]
  summary       TEXT,
  next_run_at   TIMESTAMPTZ
);

-- Pre-mortem sessions
CREATE TABLE premortems (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  messages    JSONB DEFAULT '[]',   -- [{role, content, timestamp}]
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Email notification queue
CREATE TABLE review_notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  send_at     DATE NOT NULL,
  sent_at     TIMESTAMPTZ,
  status      TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed'))
);

-- Row Level Security
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bias_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE premortems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their decisions"
  ON decisions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own their analyses"
  ON bias_analyses FOR ALL USING (auth.uid() = user_id);
```

---

## 4. Folder Structure (Next.js 14)

```
mindledger/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx             # Protected layout with sidebar
│   │   ├── dashboard/page.tsx     # Decision list + stats
│   │   ├── new/page.tsx           # Log a new decision
│   │   ├── review/[id]/page.tsx   # Review a past decision
│   │   ├── profile/
│   │   │   ├── page.tsx           # Bias profile dashboard
│   │   │   └── loading.tsx
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── decisions/
│   │   │   ├── route.ts           # GET all, POST new
│   │   │   └── [id]/route.ts      # GET one, PATCH review
│   │   ├── ai/
│   │   │   ├── premortem/route.ts # Claude pre-mortem chat
│   │   │   └── bias/route.ts      # Trigger bias analysis
│   │   ├── stripe/
│   │   │   ├── checkout/route.ts
│   │   │   └── webhook/route.ts
│   │   └── cron/
│   │       └── send-reviews/route.ts  # Daily cron job
│   ├── layout.tsx
│   └── page.tsx                   # Landing page
├── components/
│   ├── ui/                        # shadcn components
│   ├── decisions/
│   │   ├── DecisionCard.tsx
│   │   ├── DecisionForm.tsx
│   │   ├── ReviewForm.tsx
│   │   └── ConfidenceSlider.tsx
│   ├── bias/
│   │   ├── BiasProfileCard.tsx
│   │   ├── BiasBarChart.tsx
│   │   └── BiasInsightPanel.tsx
│   └── layout/
│       ├── Sidebar.tsx
│       └── TopBar.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser client
│   │   ├── server.ts              # Server client (cookies)
│   │   └── admin.ts               # Service role (cron/webhooks)
│   ├── claude.ts                  # Claude API wrapper
│   ├── stripe.ts                  # Stripe client
│   └── resend.ts                  # Email client
├── emails/
│   ├── ReviewReminder.tsx         # React Email template
│   └── WelcomeEmail.tsx
├── types/
│   └── index.ts                   # TypeScript interfaces
└── supabase/
    ├── migrations/
    └── seed.sql
```

---

## 5. Key API Routes

### POST /api/decisions — Create a decision

```typescript
// app/api/decisions/route.ts
import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, category, context, reasoning, alternatives, confidence, emotion_tags, review_date } = body

  // Check free plan limit (10/month)
  const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
  if (profile?.plan === 'free') {
    const { count } = await supabase.from('decisions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
    if ((count ?? 0) >= 10) {
      return NextResponse.json({ error: 'Monthly limit reached. Upgrade to Pro.' }, { status: 403 })
    }
  }

  const { data, error } = await supabase.from('decisions').insert({
    user_id: user.id, title, category, context, reasoning,
    alternatives: alternatives ?? [], confidence, emotion_tags: emotion_tags ?? [],
    review_date, is_locked: true
  }).select().single()

  if (error) return NextResponse.json({ error }, { status: 400 })

  // Schedule review notification
  await supabase.from('review_notifications').insert({
    decision_id: data.id, user_id: user.id, send_at: review_date
  })

  return NextResponse.json(data, { status: 201 })
}
```

### POST /api/ai/premortem — Pre-mortem chat with Claude

```typescript
// app/api/ai/premortem/route.ts
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: Request) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { decision, message, history, biasProfile } = await req.json()

  const systemPrompt = `You are a Pre-mortem Assistant for MindLedger. Your job is to be a thoughtful devil's advocate — not to block decisions, but to strengthen them.

The user is about to make this decision:
Title: ${decision.title}
Context: ${decision.context}
Their reasoning: ${decision.reasoning}
Confidence: ${decision.confidence}%
Emotions: ${decision.emotion_tags?.join(', ')}

${biasProfile ? `Their known biases from past decisions: ${JSON.stringify(biasProfile.biases?.slice(0, 3))}` : ''}

Your role:
- Ask one sharp, specific question per message
- Reference their past bias patterns when relevant (e.g. "Last time you felt this excited, X happened")
- Never lecture. Never list. Conversational tone only.
- If they've thought things through well, validate it and let them proceed
- Keep responses under 80 words`

  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    system: systemPrompt,
    messages: [
      ...history,
      { role: 'user', content: message }
    ]
  })

  return new Response(stream.toReadableStream(), {
    headers: { 'Content-Type': 'text/event-stream' }
  })
}
```

### POST /api/ai/bias — Generate bias profile

```typescript
// app/api/ai/bias/route.ts
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: Request) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Get all reviewed decisions
  const { data: decisions } = await supabase.from('decisions')
    .select('*')
    .eq('user_id', user.id)
    .not('reviewed_at', 'is', null)
    .order('created_at', { ascending: false })

  if (!decisions || decisions.length < 5) {
    return NextResponse.json({ error: 'Need at least 5 reviewed decisions for bias analysis' }, { status: 400 })
  }

  const prompt = `Analyze this person's decision history and identify their cognitive biases. 
Return ONLY a JSON object with this exact structure:

{
  "biases": [
    {
      "name": "Overconfidence bias",
      "severity": "high|medium|low",
      "score": 75,
      "trigger": "When excited about a new opportunity",
      "evidence": "In 5 out of 7 decisions where confidence > 80%, outcome_rating was below 3",
      "insight": "You tend to feel most certain exactly when you should slow down most. Your excitement is a signal to add 20% more skepticism.",
      "decision_examples": ["<decision title>", "<decision title>"]
    }
  ],
  "summary": "2-3 sentence overall pattern description",
  "strongest_asset": "What this person's data shows they're actually good at in decision-making"
}

Decision history:
${JSON.stringify(decisions.map(d => ({
  title: d.title, category: d.category,
  confidence: d.confidence, emotions: d.emotion_tags,
  outcome_rating: d.outcome_rating, hindsight: d.hindsight_notes
})))}

Return only the JSON object, no other text.`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }]
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text : ''
  const analysis = JSON.parse(raw.replace(/```json|```/g, '').trim())

  // Save to database
  await supabase.from('bias_analyses').insert({
    user_id: user.id,
    decisions_analyzed: decisions.length,
    biases: analysis.biases,
    summary: analysis.summary,
    next_run_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  })

  return NextResponse.json(analysis)
}
```

### GET /api/cron/send-reviews — Daily cron (Vercel Cron Jobs)

```typescript
// app/api/cron/send-reviews/route.ts
import { createAdminClient } from '@/lib/supabase/admin'
import { sendReviewReminder } from '@/lib/resend'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  // Verify cron secret
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const today = new Date().toISOString().split('T')[0]

  const { data: pending } = await supabase
    .from('review_notifications')
    .select(`*, decisions(*), profiles(*)`)
    .eq('send_at', today)
    .eq('status', 'pending')

  const results = await Promise.allSettled(
    (pending ?? []).map(async (n) => {
      await sendReviewReminder({
        email: n.profiles.email,
        name: n.profiles.display_name,
        decision: n.decisions
      })
      await supabase.from('review_notifications')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('id', n.id)
    })
  )

  return NextResponse.json({ sent: results.filter(r => r.status === 'fulfilled').length })
}
```

---

## 6. Environment Variables

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-xxx...

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx...
STRIPE_WEBHOOK_SECRET=whsec_xxx...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx...

# Resend
RESEND_API_KEY=re_xxx...
RESEND_FROM_EMAIL=hello@mindledger.app

# Cron
CRON_SECRET=your_random_secret_here

# App
NEXT_PUBLIC_APP_URL=https://mindledger.app
```

---

## 7. Stripe Products Setup

```typescript
// lib/stripe.ts — Stripe product IDs
export const STRIPE_PLANS = {
  pro_monthly: {
    priceId: 'price_xxx_pro_monthly',
    amount: 900,
    interval: 'month'
  },
  teams_monthly: {
    priceId: 'price_xxx_teams_monthly',
    amount: 2900,
    interval: 'month'
  }
}

// Webhook events to handle:
// checkout.session.completed → update profile.plan, store stripe_id
// customer.subscription.deleted → downgrade to free
// invoice.payment_failed → send warning email
```

---

## 8. Key React Components

### DecisionForm.tsx

```typescript
// components/decisions/DecisionForm.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const EMOTION_OPTIONS = [
  'excited', 'anxious', 'calm', 'pressured', 'hopeful',
  'fearful', 'confident', 'uncertain', 'motivated', 'reluctant'
]

export function DecisionForm() {
  const [step, setStep] = useState(1)  // Multi-step form
  const [form, setForm] = useState({
    title: '', category: 'career', context: '', reasoning: '',
    alternatives: [{ option: '', rejected_reason: '' }],
    confidence: 70, emotion_tags: [] as string[], review_date: ''
  })
  const router = useRouter()

  const handleSubmit = async () => {
    const res = await fetch('/api/decisions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (res.ok) {
      const data = await res.json()
      router.push(`/dashboard?new=${data.id}`)
    }
  }

  // Step 1: What & Why
  // Step 2: Alternatives you considered
  // Step 3: Confidence + Emotions
  // Step 4: Review date
  // Step 5: Pre-mortem (Pro feature)

  return (
    <div>
      {/* Multi-step form UI */}
      {step === 1 && <StepWhatAndWhy form={form} setForm={setForm} onNext={() => setStep(2)} />}
      {step === 2 && <StepAlternatives form={form} setForm={setForm} onNext={() => setStep(3)} />}
      {step === 3 && <StepConfidenceAndEmotions form={form} setForm={setForm} onNext={() => setStep(4)} />}
      {step === 4 && <StepReviewDate form={form} setForm={setForm} onSubmit={handleSubmit} />}
    </div>
  )
}
```

---

## 9. Vercel Configuration

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/send-reviews",
      "schedule": "0 8 * * *"
    }
  ]
}
```

---

## 10. Development Roadmap

### Phase 1 — MVP (Weeks 1–6)
- [ ] Supabase project setup + schema migration
- [ ] Auth (email + Google OAuth)
- [ ] Decision form (multi-step)
- [ ] Dashboard with decision list
- [ ] Review flow (time-lock enforced)
- [ ] Daily cron for email reminders (Resend)
- [ ] Basic outcome tracking
- [ ] Vercel deployment + custom domain

### Phase 2 — AI Layer (Weeks 7–10)
- [ ] Claude pre-mortem chat (streaming)
- [ ] Bias profile generation (10+ reviewed decisions)
- [ ] Bias profile UI dashboard
- [ ] Stripe Pro subscription
- [ ] Free plan limits enforcement
- [ ] Onboarding flow

### Phase 3 — Growth (Weeks 11–16)
- [ ] Anonymous community benchmarks
- [ ] Category-specific decision comparisons
- [ ] Decision export (PDF)
- [ ] Mobile-responsive polish
- [ ] Referral system
- [ ] SEO + blog (decision-making content)

### Phase 4 — Enterprise (Month 5+)
- [ ] Teams dashboard
- [ ] Shared decision logs
- [ ] SSO (SAML)
- [ ] Admin controls
- [ ] API access for HR/research integrations

---

## 11. Launch Checklist

```
Pre-launch:
□ Domain registered (mindledger.app)
□ Supabase project created (pro plan for cron reliability)
□ Vercel project connected to GitHub
□ All env vars set in Vercel dashboard
□ Stripe products created + webhook endpoint configured
□ Resend domain verified (SPF/DKIM)
□ Sentry project setup

Launch day:
□ Post on Product Hunt (Tuesday 12:01 AM PST)
□ Post on Hacker News: "Show HN: I built..."
□ Share on relevant subreddits (r/productivity, r/selfimprovement)
□ LinkedIn post with personal story angle
□ Email waitlist (if pre-collected)

Week 1 metrics to watch:
□ Signups
□ Decision logs created
□ Day-7 retention (did they log a second decision?)
□ Pre-mortem usage rate
```

---

## 12. Estimated Costs (at 1,000 users)

| Service | Monthly Cost |
|---|---|
| Supabase Pro | $25 |
| Vercel Pro | $20 |
| Claude API (1000 bias analyses + 5000 pre-mortem msgs) | ~$15 |
| Resend (10,000 emails) | $0 (free tier) |
| Sentry | $0 (free tier) |
| **Total** | **~$60/month** |

Break-even: **7 Pro subscribers** at $9/month.

---

*MindLedger — Built for people who want to understand themselves, not just track themselves.*
