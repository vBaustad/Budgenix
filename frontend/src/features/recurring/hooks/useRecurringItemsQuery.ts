import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchRecurringExpenses } from '../services/recurringService';
import { RecurringItemDto } from '@/types/finance/recurring';

export const RECURRING_QUERY_KEY = ['recurring-expenses'];

export function useRecurringItemsQuery() {
  const queryClient = useQueryClient();

  const query = useQuery<RecurringItemDto[], Error>({
    queryKey: RECURRING_QUERY_KEY,
    queryFn: fetchRecurringExpenses,
    staleTime: 1000 * 60 * 5, // optional: 5 minutes
  });

  // optional helper to manually refetch from external actions
  const refresh = () => queryClient.invalidateQueries({ queryKey: RECURRING_QUERY_KEY });

  return { ...query, refresh };
}
