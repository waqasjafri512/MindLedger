import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { askGroq } from '../lib/groq';
import prisma from '../lib/prisma';
import { validate, analysisSchema, hindsightSchema } from '../lib/validation';

const router = express.Router();

const ANALYSIS_SYSTEM_PROMPT = `You are MindLedger AI, a decision intelligence specialist. 
Your goal is to help users identify cognitive biases and stretch their perspective before they commit to a decision.
Be objective, analytical, and slightly provocative to encourage deep thinking.
Format your response in Markdown with the following sections:
### 🧠 Cognitive Bias Analysis
(Identify 2-3 likely biases in the reasoning provided)
### 🔮 Pre-Mortem (Failure Scenarios)
(Describe 1-2 ways this decision could fail and how to mitigate them)
### 💡 Recommendation
(One specific action to improve the decision quality)`;

router.post('/', authenticateToken, validate(analysisSchema), async (req: AuthRequest, res) => {
  const { title, context, reasoning, confidence } = req.body;

  const prompt = `
Decision Title: ${title || 'Untitled'}
Situation/Context: ${context}
Reasoning: ${reasoning}
Confidence level: ${confidence}%

Please analyze this decision for cognitive biases and provide a pre-mortem.
`;

  try {
    const analysis = await askGroq(prompt, ANALYSIS_SYSTEM_PROMPT);
    res.json({ analysis });
  } catch (err) {
    console.error('Groq Analysis Error:', err);
    res.status(500).json({ error: 'AI Analysis failed. Please try again.' });
  }
});

const HINDSIGHT_SYSTEM_PROMPT = `You are MindLedger AI, a decision calibration specialist.
Your goal is to perform a "Hindsight Reconciliation." 
You will be given the original reasoning/confidence and the actual outcome.
Identify if the user is falling into Hindsight Bias ("I knew it all along") or if they were correctly calibrated.
Format your response in Markdown:
### 🕵️ Hindsight Assessment
(Compare reasoning vs outcome)
### 📊 Calibration Note
(Was the user's confidence justified?)
### 🎓 Key Learning
(One lesson for the next time a similar decision arises)`;

router.post('/hindsight', authenticateToken, validate(hindsightSchema), async (req: AuthRequest, res) => {
  const { title, reasoning, confidence, actualOutcome } = req.body;

  const prompt = `
Decision: ${title}
Original Reasoning: ${reasoning}
Original Confidence: ${confidence}%
Actual Outcome: ${actualOutcome}

Please perform a hindsight reconciliation analysis.
`;

  try {
    const analysis = await askGroq(prompt, HINDSIGHT_SYSTEM_PROMPT);
    res.json({ analysis });
  } catch (err) {
    console.error('Groq Hindsight Error:', err);
    res.status(500).json({ error: 'AI Hindsight Analysis failed.' });
  }
});

const PROFILE_SYSTEM_PROMPT = `You are MindLedger AI, a cognitive architect.
You will be given a list of past decision titles, categories, confidence levels, and previous AI analyses.
Determine the user's "Cognitive DNA":
1. Top 3 Recurring Biases (e.g., Sunk Cost, Overconfidence).
2. Domain Expertise vs. Domain Weakness (e.g., Finance is calibrated, but Relationships are biased).
3. A Growth Roadmap (3 actionable steps to improve).
Format your response in Markdown with clear sections and high-end insights.`;

router.get('/profile-summary', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const decisions = await prisma.decision.findMany({
      where: { userId: req.user?.id, isDeleted: false },
      select: { 
        title: true, 
        category: true, 
        confidence: true, 
        aiAnalysis: true, 
        accuracyScore: true,
        isReviewed: true,
        reviewedAt: true,
      }
    });

    if (decisions.length === 0) {
      return res.json({ analysis: "Your MindLedger is currently empty. Start logging decisions to build your cognitive profile." });
    }

    const lastAnalysis = await prisma.biasAnalysis.findFirst({
      where: { userId: req.user?.id },
      orderBy: { generatedAt: 'desc' },
    });

    // Improved cache: check count AND latest review timestamp
    const latestReview = decisions
      .filter((d: any) => d.reviewedAt)
      .sort((a: any, b: any) => new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime())[0];

    const cacheIsValid = lastAnalysis 
      && lastAnalysis.decisionsAnalyzed === decisions.length 
      && lastAnalysis.summary
      && (!latestReview?.reviewedAt || new Date(latestReview.reviewedAt) < lastAnalysis.generatedAt);

    if (cacheIsValid) {
      return res.json({ analysis: lastAnalysis!.summary });
    }

    const dataSnapshot = decisions.map((d: any) => 
      `[${d.category}] ${d.title}: Confidence ${d.confidence}%, Accuracy ${d.accuracyScore ?? 'N/A'}. Analysis: ${d.aiAnalysis?.slice(0, 200)}...`
    ).join('\n---\n');

    const prompt = `Aggregate these ledger entries into a Cognitive Profile:\n${dataSnapshot}`;
    const analysis = await askGroq(prompt, PROFILE_SYSTEM_PROMPT);

    await prisma.biasAnalysis.create({
      data: {
        userId: req.user?.id as string,
        decisionsAnalyzed: decisions.length,
        biases: [],
        summary: analysis,
      }
    });

    res.json({ analysis });
  } catch (err) {
    console.error('Profile Analysis Error:', err);
    res.status(500).json({ error: 'Failed to generate profile.' });
  }
});

export default router;
