import express from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';

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
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  const { title, category, context, reasoning, alternatives, confidence, emotionTags, aiAnalysis, reviewDate } = req.body;
  if (!title || !context || !reasoning) return res.status(400).json({ error: 'Title, context, and reasoning are required.' });

  try {
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

// GET a single decision
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const decision = await prisma.decision.findFirst({
      where: { 
        id: req.params.id,
        isDeleted: false
      },
    });
    if (!decision || decision.userId !== req.user?.id) return res.status(404).json({ error: 'Decision not found.' });
    res.json(decision);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch decision.' });
  }
});

// POST outcome for a decision
router.post('/:id/outcome', authenticateToken, async (req: AuthRequest, res) => {
  const { actualOutcome, accuracyScore } = req.body;
  if (!actualOutcome) return res.status(400).json({ error: 'Actual outcome is required.' });

  try {
    const decision = await prisma.decision.update({
      where: { id: req.params.id },
      data: {
        actualOutcome,
        accuracyScore: Number(accuracyScore),
        isReviewed: true,
        reviewedAt: new Date(),
      },
    });
    
    if (!decision || decision.userId !== req.user?.id) {
      return res.status(404).json({ error: 'Decision not found.' });
    }

    res.json(decision);
  } catch (err) {
    res.status(500).json({ error: 'Failed to record outcome.' });
  }
});

// DELETE (Soft Delete) a decision
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const decision = await prisma.decision.update({
      where: { 
        id: req.params.id,
        userId: req.user?.id 
      },
      data: { isDeleted: true },
    });
    res.json({ message: 'Decision archived successfully', id: decision.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete decision.' });
  }
});

export default router;
