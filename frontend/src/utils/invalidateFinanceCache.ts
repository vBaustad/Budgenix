import { QueryClient } from '@tanstack/react-query';

export function invalidateFinanceCache(queryClient: QueryClient, monthsBack = 6) {
  const now = new Date();

  const recentMonths = Array.from({ length: monthsBack }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return { month: date.getMonth() + 1, year: date.getFullYear() };
  });

  // Invalidate list endpoints
  queryClient.invalidateQueries({ queryKey: ['expenses'] });
  queryClient.invalidateQueries({ queryKey: ['incomes'] });

  // Invalidate time-based and summary data
  for (const { month, year } of recentMonths) {
    queryClient.invalidateQueries({ queryKey: ['expensesOverview', month, year] });
    queryClient.invalidateQueries({ queryKey: ['incomeOverview', month, year] });
    queryClient.invalidateQueries({ queryKey: ['incomeMonthlySummary', month, year] });
    queryClient.invalidateQueries({ queryKey: ['dashboardSummary', month, year] });
  }
}
