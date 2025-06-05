// src/features/expenses/hooks/useInsights.ts
import { useEffect } from 'react';
import { useInsightsContext } from '@/context/InsightContext';

export function useInsights(month: number, year: number) {
  const { getInsights, refreshInsights, loading } = useInsightsContext();

  useEffect(() => {
    refreshInsights(month, year);
  }, [month, year]);

  const insights = getInsights(month, year);
  return { insights, loading };
}
