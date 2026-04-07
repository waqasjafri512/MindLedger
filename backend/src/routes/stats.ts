import express from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// GET /api/stats — Computed user statistics
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;

    const decisions = await prisma.decision.findMany({
      where: { userId, isDeleted: false },
      select: {
        confidence: true,
        accuracyScore: true,
        isReviewed: true,
        category: true,
      },
    });

    const totalDecisions = decisions.length;
    const reviewedDecisions = decisions.filter(d => d.isReviewed).length;

    // Average confidence across all decisions
    const confidences = decisions.filter(d => d.confidence !== null).map(d => d.confidence!);
    const averageConfidence = confidences.length > 0
      ? Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length)
      : 0;

    // Average accuracy across reviewed decisions
    const accuracies = decisions.filter(d => d.accuracyScore !== null).map(d => d.accuracyScore!);
    const averageAccuracy = accuracies.length > 0
      ? Math.round(accuracies.reduce((a, b) => a + b, 0) / accuracies.length)
      : null;

    // Calibration: how close is confidence to accuracy
    let calibrationGap: number | null = null;
    let calibrationLabel = 'New';
    if (averageAccuracy !== null && confidences.length > 0) {
      calibrationGap = Math.abs(averageConfidence - averageAccuracy);
      if (calibrationGap <= 10) calibrationLabel = 'Elite';
      else if (calibrationGap <= 20) calibrationLabel = 'High';
      else if (calibrationGap <= 35) calibrationLabel = 'Moderate';
      else calibrationLabel = 'Low';
    }

    // Intelligence rank based on calibration + volume
    let intelligenceRank = 'C';
    if (totalDecisions >= 10 && calibrationLabel === 'Elite') intelligenceRank = 'S';
    else if (totalDecisions >= 5 && (calibrationLabel === 'Elite' || calibrationLabel === 'High')) intelligenceRank = 'A';
    else if (totalDecisions >= 3 && calibrationLabel !== 'Low') intelligenceRank = 'B';

    // Biases detected from latest analysis
    const latestAnalysis = await prisma.biasAnalysis.findFirst({
      where: { userId },
      orderBy: { generatedAt: 'desc' },
      select: { biases: true },
    });
    
    const biases = latestAnalysis?.biases;
    const biasesDetected = Array.isArray(biases) ? biases.length : 0;

    // Category breakdown
    const categoryBreakdown: Record<string, number> = {};
    decisions.forEach(d => {
      const cat = d.category || 'general';
      categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
    });

    res.json({
      totalDecisions,
      reviewedDecisions,
      averageConfidence,
      averageAccuracy,
      calibrationGap,
      calibrationLabel,
      intelligenceRank,
      biasesDetected,
      categoryBreakdown,
    });
  } catch (err) {
    console.error('Stats Error:', err);
    res.status(500).json({ error: 'Failed to compute stats.' });
  }
});

export default router;
