import { BudgetProgressItem } from '@/types/finance/budget';

export const getBudgets = async (): Promise<BudgetProgressItem[]> => {
  const res = await fetch('/api/budget/progress');
  if (!res.ok) throw new Error('Failed to fetch budgets');
  return res.json();
};

export const updateBudget = async (id: string, amount: number): Promise<void> => {
  const res = await fetch(`/api/budget/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, allocatedAmount: amount }),
  });

  if (!res.ok) throw new Error('Failed to update budget');
};
