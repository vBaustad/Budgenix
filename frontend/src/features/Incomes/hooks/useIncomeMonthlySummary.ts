import { useQuery } from '@tanstack/react-query';

export type MonthlyIncomeSummary = {
  month: string;     // ISO string e.g. "2025-03-01"
  category: string;
  total: number;
};

export function useIncomeMonthlySummary(months: number = 6) {
  return useQuery<MonthlyIncomeSummary[]>({
    queryKey: ['incomeMonthlySummary', months],
    queryFn: async () => {
      const res = await fetch(`/api/incomes/monthly-summary?months=${months}`);
      if (!res.ok) throw new Error('Failed to fetch monthly income summary');
      return res.json();
    },
  });
}
