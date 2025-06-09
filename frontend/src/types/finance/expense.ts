import { RecurrenceFrequency } from "../shared/recurrence";

export type Expense = {
  id: string;
  name: string;
  description?: string;
  amount: number;
  date: string;
  categoryName: string;
  notes?: string | null;
};

export type CreateExpenseDto = {
  name: string;
  description?: string;
  amount: number;
  date: string;
  categoryId: string;
  notes?: string | null;

  // Optional recurrence field used only in the form — backend no longer uses this
  recurrenceFrequency?: RecurrenceFrequency;
};

export type GroupedExpenseItem = {
  groupName: string;
  totalAmount: number;
  expenses: Expense[];
};

export type GroupedExpenses = GroupedExpenseItem[];

