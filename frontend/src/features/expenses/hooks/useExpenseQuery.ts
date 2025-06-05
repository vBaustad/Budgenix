import { useQuery } from '@tanstack/react-query';
import { fetchExpenses } from '../services/expensesService';
import { GroupByValue } from '@/context/ExpensesContext';
import { Expense, GroupedExpenses } from '@/types/finance/expense';

type Params = {
  groupBy: GroupByValue;
  selectedCategories: string[];
};

export function useExpensesQuery({ groupBy, selectedCategories }: Params) {
  return useQuery<Expense[] | GroupedExpenses>({
    queryKey: ['expenses', groupBy, selectedCategories],
    queryFn: () =>
      fetchExpenses({
        groupBy: groupBy || undefined,
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
