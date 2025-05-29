// src/features/expenses/hooks/useOverviewData.ts
import { useEffect, useState } from 'react';
import { fetchExpensesOverview } from '../services/expensesService';

export function useOverviewData(month: number, year: number) {
  const [data, setData] = useState<{
    totalSpent: number;
    lastMonthSpent: number;
    incomeReceived: number;
    upcomingRecurring: number;
    dailyTotals: number[];
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchExpensesOverview(month, year);
        setData(result);
      } catch (e) {
        console.error('Failed to load overview data', e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [month, year]);

  return { data, loading };
}
