export type DashboardSummary = {
  totalSpentThisMonth: number;
  incomeReceivedThisMonth: number;
  totalSavings: number;
  activeBudgets: number;
  budgetAllocatedTotal: number;
  budgetSpentTotal: number;
  spendingVsLastMonthDiff: number;
  spendingIsUp: boolean;
  topSpendingCategory: string | null;
  topSpendingAmount: number;
  totalGoals: number;
  goalsNearCompletion: number;
};
