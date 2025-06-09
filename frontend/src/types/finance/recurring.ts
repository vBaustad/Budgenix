import { RecurrenceFrequency } from '../shared/recurrence';

export type RecurringItemDto = {
  id: string;
  name: string;
  description?: string;
  amount: number;
  startDate: string;
  endDate?: string;
  frequency: RecurrenceFrequency;
  isActive: boolean;
  type: RecurringItemType;
  categoryId?: string;

  nextOccurrenceDate: string;
  lastTriggeredDate?: string;
  lastSkippedDate?: string;
};

export type UpcomingRecurring = {
  nextDate: string;
  amount: number;
};

export enum RecurringItemType {
  Expense = 'Expense',
  Income = 'Income',
}

export type CreateRecurringItemDto = {
  name: string;
  description?: string;
  amount: number;
  startDate: string;
  endDate?: string;
  frequency: RecurrenceFrequency;
  isActive: boolean;
  type: RecurringItemType;
  categoryId?: string;

  lastTriggeredDate?: string;
  lastSkippedDate?: string;
};
