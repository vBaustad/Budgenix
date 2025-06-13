import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';


export type MonthlyIncomeSummary = {
  month: string;     // ISO string e.g. "2025-03-01"
  category: string;
  total: number;
};

export function useIncomeMonthlySummary(months: number = 6) {
  const { isLoggedIn } = useAuth();

  return useQuery<MonthlyIncomeSummary[]>({
    queryKey: ['incomeMonthlySummary', months],
    queryFn: async () => {
      return await apiFetch(`/api/incomes/monthly-summary?months=${months}`);
    },
    enabled: isLoggedIn,
  });
}

