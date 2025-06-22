import { RecurrenceFrequency } from '../shared/recurrence';

export enum RecurringItemType {
  Expense = 'Expense',
  Income = 'Income',
}

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
  categoryName?: string;

  lastSkippedDate?: string | null;
  lastTriggeredDate?: string | null;
  lastMatchedDate?: string | null;
  lastMissedDate?: string | null;

  lastMatchedTransactionId?: string | null;

  nextOccurrenceDate?: string | null;
  nextExpectedDate?: string | null;

  isFulfilledForCurrentPeriod: boolean;
};

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
};

export type UpdateRecurringItemDto = {
  name: string;
  description?: string;
  amount: number;
  startDate: string;
  endDate?: string;
  frequency: RecurrenceFrequency;
  isActive: boolean;
  type: RecurringItemType;
  categoryId?: string;
};

export type RecurringOverviewDto = {
  upcomingRecurringExpenses: RecurringItemDto[];
  upcomingRecurringIncomes: RecurringItemDto[];

  nextRecurringExpense?: RecurringItemDto | null;
  nextRecurringIncome?: RecurringItemDto | null;

  monthlyRecurringExpenseTotal: number;
  monthlyRecurringIncomeTotal: number;
  plannedNetResult: number;

  lastTriggeredRecurringExpense?: RecurringItemDto | null;
  lastSkippedRecurringExpense?: RecurringItemDto | null;
  lastTriggeredRecurringIncome?: RecurringItemDto | null;
  lastSkippedRecurringIncome?: RecurringItemDto | null;

  periodLabel?: string;
  matchedCount: number;
  unmatchedCount: number;
  matchedAmountTotal: number;
  unmatchedAmountTotal: number;

  categoryExpenseTotals: Record<string, number>;
  categoryIncomeTotals: Record<string, number>;
  upcomingRecurringExpenseTotal: number;
  upcomingRecurringIncomeTotal: number;
};

