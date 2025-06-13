import { useQuery } from '@tanstack/react-query';
import { fetchDashboardSummary } from '../services/dashboardService';
import { DashboardSummary } from '@/types/finance/DashboardSummary';
import { useDateFilter } from '@/context/DateFilterContext';
import { useAuth } from '@/context/AuthContext';

export function useDashboardSummary() {
  const { isLoggedIn } = useAuth();
  const { selectedMonth, selectedYear } = useDateFilter();

  return useQuery<DashboardSummary>({
    queryKey: ['dashboardSummary', selectedMonth, selectedYear],
    queryFn: () => fetchDashboardSummary(selectedMonth, selectedYear),
    enabled: isLoggedIn,
    staleTime: 1000 * 60 * 5,
  });
}
