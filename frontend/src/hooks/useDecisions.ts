'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchWithAuth } from '@/lib/api';
import { toast } from 'sonner';
import type { Decision } from '@/types';

export function useDecisions() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDecisions = useCallback(async () => {
    try {
      const data = await fetchWithAuth('/decisions');
      setDecisions(data);
    } catch (err) {
      console.error('Failed to load decisions', err);
      toast.error('Failed to load decisions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDecisions();
  }, [loadDecisions]);

  const handleDelete = useCallback(async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    toast('Archive this case?', {
      description: 'It will be hidden from your ledger but preserved for cognitive analysis.',
      action: {
        label: 'Archive',
        onClick: async () => {
          try {
            await fetchWithAuth(`/decisions/${id}`, { method: 'DELETE' });
            setDecisions(prev => prev.filter(d => d.id !== id));
            toast.success('Decision archived successfully.');
          } catch (err) {
            console.error('Failed to delete decision', err);
            toast.error('Failed to archive the decision.');
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  }, []);

  return { decisions, loading, handleDelete, reload: loadDecisions };
}
