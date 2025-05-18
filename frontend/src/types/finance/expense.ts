import { RecurrenceFrequency } from '../shared/recurrence';


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

export type CreateExpenseDto = {
  name: string;
  description: string;
  amount: number;
  date: string;
  categoryId: string;
  isRecurring: boolean;
  recurrenceFrequency: RecurrenceFrequency;
  notes?: string | null;
};


export type GroupedExpenseItem = {
  groupName: string;
  totalAmount: number;
  expenses: Expense[];
};

export type GroupedExpenses = GroupedExpenseItem[];

