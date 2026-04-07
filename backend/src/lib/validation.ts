import { z } from 'zod';

// --- Auth Schemas ---

export const signupSchema = z.object({
  email: z.string().email('Please provide a valid email address.').max(255),
  password: z.string().min(8, 'Password must be at least 8 characters.').max(128),
  displayName: z.string().max(100, 'Display name must be 100 characters or less.').optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

// --- Decision Schemas ---

const validCategories = ['career', 'finance', 'health', 'relationship', 'general', 'other'] as const;

export const createDecisionSchema = z.object({
  title: z.string().min(1, 'Title is required.').max(200, 'Title must be 200 characters or less.'),
  category: z.string().optional().default('general'),
  context: z.string().min(1, 'Context is required.').max(5000, 'Context must be 5000 characters or less.'),
  reasoning: z.string().min(1, 'Reasoning is required.').max(5000, 'Reasoning must be 5000 characters or less.'),
  alternatives: z.any().optional(),
  confidence: z.number().min(0).max(100).optional().default(50),
  emotionTags: z.array(z.string().max(50)).max(10).optional().default([]),
  aiAnalysis: z.string().max(10000).optional().nullable(),
  reviewDate: z.string().min(1, 'Review date is required.'),
});

export const outcomeSchema = z.object({
  actualOutcome: z.string().min(1, 'Actual outcome is required.').max(5000, 'Outcome must be 5000 characters or less.'),
  accuracyScore: z.number().min(0).max(100).optional().default(50),
});

// --- Analysis Schemas ---

export const analysisSchema = z.object({
  title: z.string().max(200).optional().default('Untitled'),
  context: z.string().min(1, 'Context is required for analysis.').max(5000),
  reasoning: z.string().min(1, 'Reasoning is required for analysis.').max(5000),
  confidence: z.number().min(0).max(100).optional().default(50),
});

export const hindsightSchema = z.object({
  title: z.string().max(200).optional(),
  reasoning: z.string().min(1, 'Original reasoning is required.').max(5000),
  confidence: z.number().min(0).max(100).optional(),
  actualOutcome: z.string().min(1, 'Actual outcome is required.').max(5000),
});

// --- Validation Helper ---

import { Request, Response, NextFunction } from 'express';

export function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map(e => e.message);
      return res.status(400).json({ error: errors[0], errors });
    }
    req.body = result.data; // Use parsed/sanitized data
    next();
  };
}
