import { toast } from 'react-hot-toast';
import { fetchRecurringExpenses, triggerRecurringItem } from '../services/recurringService';
import { RecurringExpenseDto } from '@/types/finance/recurring';

export async function markRecurringAsPaid(
  id: string,
  onRefresh: (items: RecurringExpenseDto[]) => void
): Promise<void> {
  try {
    await triggerRecurringItem(id);
    toast.success('Marked as paid!');
    const updated = await fetchRecurringExpenses();
    onRefresh(updated);
  } catch (err) {
    toast.error((err as Error).message);
  }
}
