import { toast } from 'react-hot-toast';
import { deleteRecurringItem, fetchRecurringExpenses } from '../services/recurringService';
import { RecurringExpenseDto } from '@/types/finance/recurring';

export async function deleteRecurring(
  id: string,
  onRefresh?: (items: RecurringExpenseDto[]) => void
): Promise<void> {
  toast.custom((t) => {
    const handleDelete = async () => {
      const loadingId = toast.loading('Deleting...');
      try {
        await deleteRecurringItem(id);
        toast.success('Recurring item deleted', { id: loadingId });

        if (onRefresh) {
          const updated = await fetchRecurringExpenses();
          onRefresh(updated);
        }
      } catch {
        toast.error('Failed to delete', { id: loadingId });
      } finally {
        toast.dismiss(t.id);
      }
    };

    return (
      <div className="bg-base-100 text-base-content p-4 rounded-xl shadow-lg border border-base-300 w-[260px]">
        <p className="text-sm font-medium">Delete this recurring item?</p>
        <div className="flex justify-end gap-2 mt-3">
          <button className="btn btn-xs btn-error" onClick={handleDelete}>
            Delete
          </button>
          <button className="btn btn-xs btn-ghost" onClick={() => toast.dismiss(t.id)}>
            Cancel
          </button>
        </div>
      </div>
    );
  }, {
    position: 'top-center',
  });
}
