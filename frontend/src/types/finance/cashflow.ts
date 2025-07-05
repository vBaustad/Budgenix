import { RecurrenceFrequency } from "../shared/recurrence";

export type CashflowItemType = 'Income' | 'Expense';

export interface CategoryBreakdownDto {
  categoryId: string | null;
  monthlyTotal: number;
  annualTotal: number;
  type: CashflowItemType;
}

export interface CashflowSummaryDto {
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
  monthlyBalance: number;

  annualIncome: number;
  annualExpenses: number;
  annualSavings: number;
  annualBalance: number;

  categoryBreakdown: CategoryBreakdownDto[];
}

export interface CashflowItem {
  id: string;
  name: string;
  amount: number;
  frequency: RecurrenceFrequency;
  type: CashflowItemType;
  person?: string;
  categoryName?: string;
  categoryColor?: string;
  monthlyAmount: number;
}

export interface CreateCashflowItemDto {
  name: string;
  amount: number;
  frequency: RecurrenceFrequency;
  type: CashflowItemType;
  person?: string;
  categoryId?: string;
}

export type UpdateCashflowItemDto = CreateCashflowItemDto;
