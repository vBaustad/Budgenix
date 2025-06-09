import { useCurrency } from '@/context/CurrencyContext';
import { RecurringItemDto } from '@/types/finance/recurring';
import { RecurrenceFrequencyLabels } from '@/types/shared/recurrence';
import { formatCurrency, formatDate } from '@/utils/formatting';
import { AppIcons } from '@/components/icons/AppIcons';
import { useRecurringActions } from '@/features/recurring/hooks/useRecurringActions';

type Props = {
  recurringItems: RecurringItemDto[];
  loading: boolean;
  onSelect?: (item: RecurringItemDto) => void;
};

const MAX_UPCOMING = 3;

export default function UpcomingRecurringItemsList({ recurringItems, loading, onSelect }: Props) {
  const { currency: userCurrency } = useCurrency();
  const { remove, skip, markAsPaid } = useRecurringActions();

  if (loading) return <span className="loading loading-spinner loading-md" />;
  if (recurringItems.length === 0)
    return <p className="text-base-content">No recurring expenses found.</p>;

  return (
    <ul className="space-y-4">
      {[...recurringItems]
        .sort((a, b) => new Date(a.nextOccurrenceDate).getTime() - new Date(b.nextOccurrenceDate).getTime())
        .slice(0, MAX_UPCOMING)
        .map((exp) => (
          <li
            key={exp.id}
            className="relative bg-base-100 rounded-xl p-2 border border-base-300 shadow-md w-full"
          >
            <div className="flex justify-between items-center">
              <div className="flex justify-between">
                <div className="font-medium text-base-content">{exp.name}</div>
                <div className="flex items-center gap-1 text-sm text-base-content ml-4">
                  <AppIcons.calendar className="w-4 h-4" />
                  {formatDate(exp.nextOccurrenceDate)} · {RecurrenceFrequencyLabels[exp.frequency]}
                </div>
              </div>
              <div className="text-sm font-semibold text-base-content">
                  {formatCurrency(exp.amount, userCurrency)}
              </div>
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
                className="btn btn-xs btn-info" 
                onClick={() => skip(exp.id)}
              >
                <AppIcons.recurring className="w-4 h-4" />
                Skip
              </button>
              <button
                className="btn btn-xs btn-warning"
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
