import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';

export type MonthlyIncomeSummary = {
  month: string;    // ISO string e.g. "2025-03-01"
  category: string;
  total: number;
};

async function fetchIncomeMonthlySummary(months: number): Promise<MonthlyIncomeSummary[]> {
  const result = await apiFetch<MonthlyIncomeSummary[]>(`/api/incomes/monthly-summary?months=${months}`);

  if (!result) {
    throw new Error('Failed to fetch monthly income summary');
  }

  return result;
}

export function useIncomeMonthlySummary(months: number = 6) {
  const { isLoggedIn } = useAuth();

  return useQuery<MonthlyIncomeSummary[]>({
    queryKey: ['incomeMonthlySummary', months],
    queryFn: () => fetchIncomeMonthlySummary(months),
    enabled: isLoggedIn,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
