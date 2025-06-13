import { toast } from 'react-hot-toast';
import { triggerRecurringItem } from '../services/recurringService';

export async function markRecurringAsPaid(id: string): Promise<void> {
  try {
    await triggerRecurringItem(id);
    toast.success('Marked as paid!');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to mark as paid.';
    toast.error(message);
    throw err;
  }
}
