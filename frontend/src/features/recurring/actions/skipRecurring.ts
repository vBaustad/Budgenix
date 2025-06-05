import { RecurringExpenseDto } from '@/types/finance/recurring';
import { skipRecurringItem, fetchRecurringExpenses } from '../services/recurringService';

export async function skipRecurring(id: string, onRefresh: (items: RecurringExpenseDto[]) => void) {
  try {
    await skipRecurringItem(id);
    const updated = await fetchRecurringExpenses();
    onRefresh(updated);
  } catch (err) {
    console.error('[Recurring] Failed to skip recurring item', err);
  }
}
