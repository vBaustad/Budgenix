import { toast } from 'react-hot-toast';
import { fetchRecurringExpenses, triggerRecurringItem } from '../services/recurringService';
import { RecurringItemDto } from '@/types/finance/recurring';

export async function markRecurringAsPaid(
  id: string,
  onRefresh: (items: RecurringItemDto[]) => void
): Promise<void> {
  try {
    await triggerRecurringItem(id);
    toast.success('Marked as paid!');

    const updated = await fetchRecurringExpenses();
    onRefresh(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to mark as paid.';
    toast.error(message);
  }
}
