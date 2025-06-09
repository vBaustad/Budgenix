
export type Income = {
  id: string;
  name: string;
  description: string;
  amount: number;
  date: string;
  categoryName: string;
  notes?: string | null;
};

export type CreateIncomeDto = {
  name: string;
  description?: string;
  amount: number;
  date: string;
  categoryId: string;
  notes?: string | null;
};


export type IncomeOverviewDto = {
  totalIncome: number;
  lastMonthIncome: number;
  upcomingRecurring: {
    nextDate: string;
    amount: number;
  } | null;
  dailyTotals: number[];
};

export type GroupedIncomeItem = {
  groupName: string;
  totalAmount: number;
  incomes: Income[];
};

export type GroupedIncomes = GroupedIncomeItem[];
