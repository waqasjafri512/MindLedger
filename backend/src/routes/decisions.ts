import express from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validate, createDecisionSchema, outcomeSchema } from '../lib/validation';

const router = express.Router();

// GET all decisions for the user
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const decisions = await prisma.decision.findMany({
      where: { 
        userId: req.user?.id,
        isDeleted: false
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(decisions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch decisions.' });
  }
});

// POST new decision
router.post('/', authenticateToken, validate(createDecisionSchema), async (req: AuthRequest, res) => {
  const { title, category, context, reasoning, alternatives, confidence, emotionTags, aiAnalysis, reviewDate } = req.body;

  try {
    // Check subscription limits for Free tier
    const user = await prisma.user.findUnique({ where: { id: req.user?.id } });
    if (user?.plan === 'free') {
      const count = await prisma.decision.count({ 
        where: { userId: req.user?.id, isDeleted: false } 
      });
      if (count >= 5) {
        return res.status(403).json({ 
          error: 'Free tier limit reached (5 cases). Please upgrade to Pro for unlimited archival intelligence.' 
        });
      }
    }

    const decision = await prisma.decision.create({
      data: {
        userId: req.user?.id as string,
        title,
        category,
        context,
        reasoning,
        alternatives: alternatives || [],
        confidence,
        emotionTags: emotionTags || [],
        aiAnalysis,
        reviewDate: new Date(reviewDate),
        isLocked: true,
      },
    });
    res.status(201).json(decision);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create decision.' });
  }
});

// GET a single decision (secured: userId in where clause)
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const decision = await prisma.decision.findFirst({
      where: { 
        id: req.params.id,
        userId: req.user?.id,
        isDeleted: false
      },
    });
    if (!decision) return res.status(404).json({ error: 'Decision not found.' });
    res.json(decision);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch decision.' });
  }
});

// POST outcome for a decision (FIXED: userId in where clause — prevents IDOR)
router.post('/:id/outcome', authenticateToken, validate(outcomeSchema), async (req: AuthRequest, res) => {
  const { actualOutcome, accuracyScore } = req.body;

  try {
    // First verify ownership
    const existing = await prisma.decision.findFirst({
      where: { id: req.params.id, userId: req.user?.id, isDeleted: false },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Decision not found.' });
    }

    // Check review date enforcement
    if (new Date(existing.reviewDate) > new Date()) {
      return res.status(400).json({ error: 'Review date has not been reached yet.' });
    }

    // Then update
    const decision = await prisma.decision.update({
      where: { id: req.params.id },
      data: {
        actualOutcome,
        accuracyScore: Math.min(100, Math.max(0, accuracyScore)),
        isReviewed: true,
        reviewedAt: new Date(),
      },
    });

    res.json(decision);
  } catch (err) {
    res.status(500).json({ error: 'Failed to record outcome.' });
  }
});

// DELETE (Soft Delete) a decision (secured: userId in where clause)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const existing = await prisma.decision.findFirst({
      where: { id: req.params.id, userId: req.user?.id, isDeleted: false },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Decision not found.' });
    }

    await prisma.decision.update({
      where: { id: req.params.id },
      data: { isDeleted: true },
    });

    res.json({ message: 'Decision archived successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete decision.' });
  }
});

export default router;
