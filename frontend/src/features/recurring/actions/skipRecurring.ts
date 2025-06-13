import { skipRecurringItem } from '../services/recurringService';

export async function skipRecurring(id: string): Promise<void> {
  try {
    await skipRecurringItem(id);
  } catch (err) {
    console.error('[Recurring] Failed to skip recurring item', err);
    throw err;
  }
}
