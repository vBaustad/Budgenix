export type Expense = {
  id: string;
  name: string;
  description?: string;
  amount: number;
  date: string;
  categoryName: string;
  categoryId: string;
  notes?: string | null;
};

type ExpenseDtoBase = {
  name: string;
  description?: string;
  amount: number;
  date: string;
  categoryId: string;
  notes?: string | null;
};

export type ExpenseOverviewDto = {
  totalExpense: number;
  lastMonthExpense: number;
  dailyTotals: number[];
};

export type GroupedExpenseItem = {
  groupName: string;
  totalAmount: number;
  expenses: Expense[];
};

export type GroupedExpenses = GroupedExpenseItem[];
export type CreateExpenseDto = ExpenseDtoBase;
export type UpdateExpenseDto = ExpenseDtoBase;
