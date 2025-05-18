import { useCurrency } from '../../../context/CurrencyContext';
import { fetchRecurringExpenses, skipRecurringItem, triggerRecurringItem } from '../../../services/app/recurringService';
import { RecurringExpenseDto } from '../../../types/finance/recurring';
import { RecurrenceFrequencyLabels } from '../../../types/shared/recurrence';
import { formatCurrency, formatDate } from '../../../utils/formatting';

import toast from 'react-hot-toast';

type Props = {
  recurringExpenses: RecurringExpenseDto[];
  setRecurringExpenses: React.Dispatch<React.SetStateAction<RecurringExpenseDto[]>>;
  loading: boolean;
  onSelect?: (item: RecurringExpenseDto) => void;
};

const MAX_UPCOMING = 3;



export default function UpcomingRecurringList({ recurringExpenses, setRecurringExpenses, loading, onSelect }: Props) {
  const { currency: userCurrency } = useCurrency();

  if (loading) return <span className="loading loading-spinner loading-md" />;
  if (recurringExpenses.length === 0)
    return <p className="text-base-content/70">No recurring expenses found.</p>;

  const handleMarkAsPaid = async (id: string) => {
  try {
    await triggerRecurringItem(id);
    toast.success("Marked as paid!");
    const updated = await fetchRecurringExpenses();
    setRecurringExpenses(updated);  
  } catch (err) {
    toast.error((err as Error).message);
  }
  };

  const handleSkip = async (id: string) => {
  try {
    await skipRecurringItem(id);
    toast.success("Skipped this occurrence.");
    const updated = await fetchRecurringExpenses();
    setRecurringExpenses(updated);  
  } catch (err) {
    toast.error((err as Error).message);
  }
  };

  return (
    <ul className="mt-4 space-y-4">
      {[...recurringExpenses]
        .sort((a, b) => new Date(a.nextOccurrenceDate).getTime() - new Date(b.nextOccurrenceDate).getTime())
        .slice(0, MAX_UPCOMING)
        .map((exp) => (
          <li
            key={exp.id}
            className="bg-primary/10 rounded-xl p-2 border border-primary shadow-md w-full"
          >
            <div className="flex justify-between items-center">
              <div className="font-medium text-base-content">{exp.name}</div>
              <div className="text-sm font-semibold text-base-content">
                {formatCurrency(exp.amount, userCurrency)}
              </div>
            </div>
            <div className="text-sm text-base-content mt-1">
              🗓️ {formatDate(exp.nextOccurrenceDate)} · {RecurrenceFrequencyLabels[exp.frequency]}
            </div>
            {/* Action buttons */}
            <div className="flex gap-2 mt-3">
              <button
                className="btn btn-xs btn-success"
                onClick={() => handleMarkAsPaid(exp.id)}
              >
                ✓ Mark Paid
              </button>
              <button
                className="btn btn-xs btn-outline"
                onClick={() => handleSkip(exp.id)}
              >
                ⏭ Skip
              </button>
                <button
                  className="btn btn-xs btn-outline"
                  onClick={() => onSelect?.(exp)}
                >
                  ✏️ Edit
                </button>
             </div>
          </li>
        ))}
    </ul>
  );
}
