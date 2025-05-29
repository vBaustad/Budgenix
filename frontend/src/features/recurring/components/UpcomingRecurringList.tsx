import { useCurrency } from '@/context/CurrencyContext';
import { RecurringExpenseDto } from '@/types/finance/recurring';
import { RecurrenceFrequencyLabels } from '@/types/shared/recurrence';
import { formatCurrency, formatDate } from '@/utils/formatting';
import { AppIcons } from '@/components/icons/AppIcons';
import { useRecurringActions } from '@/features/recurring/hooks/useRecurringActions';

type Props = {
  recurringExpenses: RecurringExpenseDto[];
  setRecurringExpenses: React.Dispatch<React.SetStateAction<RecurringExpenseDto[]>>;
  loading: boolean;
  onSelect?: (item: RecurringExpenseDto) => void;
};

const MAX_UPCOMING = 3;

export default function UpcomingRecurringList({ recurringExpenses, setRecurringExpenses, loading, onSelect }: Props) {
  const { currency: userCurrency } = useCurrency();
  const { remove, skip, markAsPaid } = useRecurringActions(setRecurringExpenses);

  if (loading) return <span className="loading loading-spinner loading-md" />;
  if (recurringExpenses.length === 0)
    return <p className="text-base-content/70">No recurring expenses found.</p>;

  return (
    <ul className="mt-4 space-y-4">
      {[...recurringExpenses]
        .sort((a, b) => new Date(a.nextOccurrenceDate).getTime() - new Date(b.nextOccurrenceDate).getTime())
        .slice(0, MAX_UPCOMING)
        .map((exp) => (
          <li
            key={exp.id}
            className="relative bg-primary/10 rounded-xl p-2 border border-primary shadow-md w-full"
          >
            <div className="flex justify-between items-center">
              <div className="font-medium text-base-content">{exp.name}</div>
              <div className="text-sm font-semibold text-base-content">
                {formatCurrency(exp.amount, userCurrency)}
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-base-content mt-1">
              <AppIcons.calendar className="w-4 h-4" />
              {formatDate(exp.nextOccurrenceDate)} · {RecurrenceFrequencyLabels[exp.frequency]}
            </div>
            {/* Action buttons */}
            <div className="flex gap-2 mt-3">
              <button
                className="btn btn-xs btn-success"
                onClick={() => markAsPaid(exp.id)}
              >
                <AppIcons.complete className="w-4 h-4" />
                Mark Paid
              </button>
              <button 
                className="btn btn-xs btn-outline" 
                onClick={() => skip(exp.id)}
              >
                <AppIcons.recurring className="w-4 h-4" />
                Skip
              </button>
              <button
                className="btn btn-xs btn-outline"
                onClick={() => onSelect?.(exp)}
              >
                <AppIcons.edit className="w-4 h-4" />
                Edit
              </button>
            </div>
            <button
              className="absolute bottom-2 right-2 p-1 rounded-md hover:bg-error/20 transition"
              onClick={() => remove(exp.id)}
              aria-label="Delete"
              title="Delete"
            >
              <AppIcons.delete className="w-4 h-4 text-error hover:text-error-content" />
            </button>
          </li>
        ))}
    </ul>
  );
}
