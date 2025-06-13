import { useEffect } from 'react';
import { useInsightsContext } from '@/context/InsightContext';
import { useAuth } from '@/context/AuthContext'; // 👈

export function useInsights(month: number, year: number) {
  const { isLoggedIn } = useAuth(); // 👈
  const { getInsights, refreshInsights, loading } = useInsightsContext();

  useEffect(() => {
    if (isLoggedIn) {
      refreshInsights(month, year);
    }
  }, [month, year, isLoggedIn]);

  const insights = isLoggedIn ? getInsights(month, year) : [];

  return { insights, loading };
}
