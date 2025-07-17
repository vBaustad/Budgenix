export type Income = {
  id: string;
  name: string;
  description?: string;
  amount: number;
  date: string;
  categoryName: string;
  categoryId: string;
  notes?: string | null;
};

type IncomeDtoBase = {
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
  dailyTotals: number[];
  annualIncome: number;
  avgMonthly: number;
};


export type GroupedIncomeItem = {
  groupName: string;
  totalAmount: number;
  incomes: Income[];
};

export type GroupedIncomes = GroupedIncomeItem[];
export type CreateIncomeDto = IncomeDtoBase;
export type UpdateIncomeDto = IncomeDtoBase;