import { RecurrenceFrequency } from '../shared/recurrence';

export type RecurringExpenseDto = {
  id: string;
  name: string;
  description: string;
  amount: number;
  startDate: string;
  endDate?: string;
  frequency: RecurrenceFrequency;
  isActive: boolean;
  type: 'Income' | 'Expense';
  categoryId?: string;

  nextOccurrenceDate: string;
  lastTriggeredDate?: string;
  lastSkippedDate?: string;
};


export type RecurringItemFormDto = {
  name: string;
  description: string;
  amount: number;
  startDate: string;
  endDate?: string;
  frequency: RecurrenceFrequency;
  isActive: boolean;
  type: 'Income' | 'Expense';
  categoryId?: string;

  lastTriggeredDate?: string;
  lastSkippedDate?: string;
};
