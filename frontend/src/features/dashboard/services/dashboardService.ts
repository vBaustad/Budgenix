import { apiFetch } from '@/utils/api';
import { DashboardSummary } from '@/types/finance/DashboardSummary';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';

export async function fetchDashboardSummary(month: number, year: number): Promise<DashboardSummary> {
  const result = await apiFetch<DashboardSummary | null>(`/api/dashboard/summary?month=${month}&year=${year}`);
  if (!result) throw new Error('Failed to fetch dashboard summary');
  return result;
}

export function useDashboardSummary(month: number | undefined, year: number | undefined) {
  const { isLoggedIn } = useAuth();

  return useQuery<DashboardSummary>({
    queryKey: ['dashboardSummary', month, year],
    queryFn: () => fetchDashboardSummary(month!, year!),
    enabled: isLoggedIn && !!month && !!year,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
