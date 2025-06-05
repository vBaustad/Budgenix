export type IncomeItem = {
  id: string;
  name: string;
  amount: number;
  date: string;
  categoryName?: string;
  isRecurring: boolean;
};

export type IncomeOverviewDto = {
  totalIncome: number;
  lastMonthIncome: number;
  upcomingRecurring: number;
  dailyTotals: number[];
};
