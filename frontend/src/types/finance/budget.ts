import { RecurrenceFrequency } from "../shared/recurrence";

export enum BudgetTypeEnum {
  Spending = 'Spending',
  Savings = 'Savings'
}

export interface BudgetDto {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  allocatedAmount: number;
  recurrence: RecurrenceFrequency;
  startDate: string;        // ISO string
  endDate?: string | null;
  type: BudgetTypeEnum;
  notes?: string | null;
  isActive: boolean;
}

export interface BudgetProgressDto {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  allocatedAmount: number;
  totalSpent: number;
  remainingAmount: number;
  percentUsed: number;
  recurrence: RecurrenceFrequency;
  isOverBudget: boolean;
}

export interface CreateBudgetDto {
  name: string;
  categoryId: string;
  allocatedAmount: number;
  recurrence: RecurrenceFrequency;
  startDate: string;
  endDate?: string | null;
  type: BudgetTypeEnum;
  notes?: string | null;
  isActive: boolean;
}

export interface UpdateBudgetDto {
  id: string;
  name: string;
  categoryId: string;
  allocatedAmount: number;
  recurrence: RecurrenceFrequency;
  startDate: string;
  endDate?: string | null;
  type: BudgetTypeEnum;
  notes?: string | null;
  isActive: boolean;
}
