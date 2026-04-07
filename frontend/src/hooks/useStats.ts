'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchWithAuth } from '@/lib/api';
import type { UserStats } from '@/types';

const defaultStats: UserStats = {
  totalDecisions: 0,
  reviewedDecisions: 0,
  averageConfidence: 0,
  averageAccuracy: null,
  calibrationGap: null,
  calibrationLabel: 'New',
  intelligenceRank: 'C',
  biasesDetected: 0,
  categoryBreakdown: {},
};

export function useStats() {
  const [stats, setStats] = useState<UserStats>(defaultStats);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const data = await fetchWithAuth('/stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return { stats, loading, reload: loadStats };
}
