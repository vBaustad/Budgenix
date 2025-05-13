// /types/finance/expense.ts
export type Expense = {
  id: string;
  name: string;
  description: string;
  amount: number;
  date: string;
  categoryName: string;
  isRecurring: boolean;
  recurrenceFrequency: number;
  notes?: string | null;
};

export type GroupedExpenseItem = {
  group: string;
  expenses: Expense[];
};

export type GroupedExpenses = GroupedExpenseItem[];

export enum RecurrenceFrequency {
  None = 0,
  Daily = 1,
  Weekly = 2,
  Monthly = 3,
  Yearly = 4,
}
  