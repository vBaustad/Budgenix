// src/features/recurring/hooks/useRecurringActions.ts
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { deleteRecurring } from '../actions/deleteRecurring';
import { skipRecurring } from '../actions/skipRecurring';
import { markRecurringAsPaid } from '../actions/markRecurringAsPaid';

export function useRecurringActions() {
  const queryClient = useQueryClient();

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['recurringExpenses'] });
  }, [queryClient]);

  const remove = useCallback(async (id: string) => {
    await deleteRecurring(id);
    refresh();
  }, [refresh]);

  const skip = useCallback(async (id: string) => {
    await skipRecurring(id, refresh);
  }, [refresh]);


  const markAsPaid = useCallback(async (id: string) => {
    await markRecurringAsPaid(id, refresh);
    }, [refresh]);

  return {
    remove,
    skip,
    markAsPaid,
    refresh,
  };
}
