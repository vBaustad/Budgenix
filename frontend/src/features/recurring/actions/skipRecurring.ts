import { toast } from 'react-hot-toast';
import { skipRecurringItem, fetchRecurringExpenses } from '../services/recurringService';
import { RecurringExpenseDto } from '@/types/finance/recurring';

export async function skipRecurring(
  id: string,
  onRefresh: (items: RecurringExpenseDto[]) => void
): Promise<void> {
  try {
    await skipRecurringItem(id);
    toast.success("Skipped this occurrence.");
    const updated = await fetchRecurringExpenses();
    onRefresh(updated);
  } catch (err) {
    toast.error((err as Error).message);
  }
}
