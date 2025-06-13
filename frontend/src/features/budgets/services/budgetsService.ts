import { BudgetProgressItem } from '@/types/finance/budget';
import { apiFetch } from '@/utils/api'; // Adjust path if needed

export const getBudgets = async (): Promise<BudgetProgressItem[]> => {
  return await apiFetch('/api/budget/progress');
};

export const updateBudget = async (id: string, amount: number): Promise<void> => {
  await apiFetch(`/api/budget/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, allocatedAmount: amount }),
  });
};
