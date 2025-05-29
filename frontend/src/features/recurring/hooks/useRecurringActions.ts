import { useCallback } from 'react';
import { deleteRecurring } from '../actions/deleteRecurring';
import { skipRecurring } from '../actions/skipRecurring';
import { markRecurringAsPaid } from '../actions/markRecurringAsPaid';
import { fetchRecurringExpenses } from '../services/recurringService';
import { RecurringExpenseDto } from '@/types/finance/recurring';

/**
 * Provides all recurring item handlers with automatic refresh logic.
 */
export function useRecurringActions(setRecurringExpenses: (items: RecurringExpenseDto[]) => void) {
  const refresh = useCallback(async () => {
    const updated = await fetchRecurringExpenses();
    setRecurringExpenses(updated);
  }, [setRecurringExpenses]);

  const remove = useCallback((id: string) => {
    deleteRecurring(id, refresh);
  }, [refresh]);

  const skip = useCallback((id: string) => {
    skipRecurring(id, setRecurringExpenses);
  }, [setRecurringExpenses]);

  const markAsPaid = useCallback((id: string) => {
    markRecurringAsPaid(id, setRecurringExpenses);
  }, [setRecurringExpenses]);

  return {
    remove,
    skip,
    markAsPaid,
    refresh,
  };
}
