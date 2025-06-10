export interface BudgetProgressItem {
  id: string;
  name: string;
  allocatedAmount: number;
  totalSpent: number;
  remainingAmount: number;
  percentUsed: number;
  recurrence: string;
  isOverBudget: boolean;
}
