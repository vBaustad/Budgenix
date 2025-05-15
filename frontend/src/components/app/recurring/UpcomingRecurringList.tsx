
import { RecurringExpenseDto } from '../../../types/finance/recurring';
import { RecurrenceFrequencyLabels } from '../../../types/shared/recurrence';
import { formatDate } from '../../../utils/formatting';
import toast from 'react-hot-toast';

type Props = {
  recurringExpenses: RecurringExpenseDto[];
  loading: boolean;
  onSelect?: (item: RecurringExpenseDto) => void;
};


const MAX_UPCOMING = 3;

const handleMarkAsPaid = async (id: string) => {
  // call backend to create a real expense based on recurring item
  toast.success("Marked as paid!");
};

const handleSkip = async (id: string) => {
  // call backend to defer or deactivate one occurrence
  toast.success("Skipped this occurrence.");
};



export default function UpcomingRecurringList({ recurringExpenses, loading, onSelect }: Props) {
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
            className="bg-primary/70 rounded-xl p-2 border border-base-200 shadow-md w-full"
          >
            <div className="flex justify-between items-center">
              <div className="font-medium text-primary-content">{exp.name}</div>
              <div className="text-sm font-semibold text-primary-content">
                ${exp.amount.toFixed(2)}
              </div>
            </div>
            <div className="text-sm text-primary-content/80 mt-1">
              🗓️ {formatDate(exp.nextOccurrenceDate)} · {RecurrenceFrequencyLabels[exp.frequency]}
            </div>
            {/* Action buttons */}
            <div className="flex gap-2 mt-3">
              <button
                className="btn btn-xs btn-info"
                onClick={() => handleMarkAsPaid(exp.id)}
              >
                ✓ Mark Paid
              </button>
              <button
                className="btn btn-xs btn-info"
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
