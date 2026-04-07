// --- User Types ---

export interface User {
  id: string;
  email: string;
  displayName?: string;
  plan: string;
}

// --- Decision Types ---

export interface Alternative {
  option: string;
  rejected_reason: string;
}

export interface Decision {
  id: string;
  userId: string;
  title: string;
  category: string | null;
  context: string;
  reasoning: string;
  alternatives: Alternative[] | null;
  confidence: number | null;
  emotionTags: string[];
  aiAnalysis: string | null;
  reviewDate: string;
  isLocked: boolean;
  isReviewed: boolean;
  actualOutcome: string | null;
  accuracyScore: number | null;
  reviewedAt: string | null;
  outcome: string | null;
  outcomeRating: number | null;
  hindsightNotes: string | null;
  isDeleted: boolean;
  createdAt: string;
}

// --- Bias Analysis Types ---

export interface BiasEntry {
  name: string;
  severity: 'high' | 'medium' | 'low';
  score: number;
  trigger: string;
  evidence: string;
  insight: string;
  decision_examples: string[];
}

export interface BiasAnalysis {
  id: string;
  userId: string;
  generatedAt: string;
  decisionsAnalyzed: number;
  biases: BiasEntry[];
  summary: string | null;
  strongestAsset: string | null;
}

// --- API Response Types ---

export interface AnalysisResponse {
  analysis: string;
}

export interface ApiError {
  error: string;
  errors?: string[];
}

// --- Stats Types ---

export interface UserStats {
  totalDecisions: number;
  reviewedDecisions: number;
  averageConfidence: number;
  averageAccuracy: number | null;
  calibrationGap: number | null;
  calibrationLabel: string;
  intelligenceRank: string;
  biasesDetected: number;
  categoryBreakdown: Record<string, number>;
}
