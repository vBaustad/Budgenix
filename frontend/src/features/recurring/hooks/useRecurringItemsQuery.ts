import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/utils/api';
import { RecurringItemDto } from '@/types/finance/recurring';

export const RECURRING_QUERY_KEY = ['recurring-expenses'];

export async function fetchRecurringExpenses(): Promise<RecurringItemDto[]> {
  return apiFetch('/api/recurring/upcoming');
}

export function useRecurringItemsQuery(enabled = true) {
  const queryClient = useQueryClient();

  const query = useQuery<RecurringItemDto[], Error>({
    queryKey: RECURRING_QUERY_KEY,
    queryFn: fetchRecurringExpenses,
    enabled,
    staleTime: 1000 * 60 * 5,
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: RECURRING_QUERY_KEY });

  return { ...query, refresh };
}
