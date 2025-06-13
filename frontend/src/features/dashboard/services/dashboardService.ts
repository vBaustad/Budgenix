import { apiFetch } from '@/utils/api';
import { DashboardSummary } from '@/types/finance/DashboardSummary';

export async function fetchDashboardSummary(month: number, year: number): Promise<DashboardSummary> {
  return await apiFetch(`/api/dashboard/summary?month=${month}&year=${year}`);
}
