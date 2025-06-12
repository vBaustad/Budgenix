import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getBudgets, updateBudget } from '../services/budgetsService';
import { BudgetProgressItem } from '@/types/finance/budget';

export function useBudgetsQuery() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<BudgetProgressItem[]>({
    queryKey: ['budgets', 'progress'],
    queryFn: getBudgets,
  });

  const mutation = useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) => updateBudget(id, amount),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['budgets', 'progress'] })
,
  });

  const updateAmount = async (id: string, amount: number) => {
    await mutation.mutateAsync({ id, amount });
  };

  return {
    data,
    isLoading,
    updateAmount,
  };
}
