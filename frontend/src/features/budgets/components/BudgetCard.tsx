import { BudgetProgressItem } from '@/types/finance/budget';
import { AppIcons } from '@/components/icons/AppIcons';
import { formatCurrency, getRecurrenceLabel } from '@/utils/formatting';
import { useBudgets } from '../context/BudgetsContext';

type Props = {
  budget: BudgetProgressItem;
};

export default function BudgetCard({ budget }: Props) {
  const { updateBudgetAmount } = useBudgets();

  return (
    <div className="card bg-base-100 shadow-xl p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="font-medium text-lg flex items-center gap-2">
            {budget.name}
            <span className="badge badge-sm badge-neutral">{getRecurrenceLabel(budget.recurrence)}</span>
          </h2>
          <p className="text-sm text-base-content/70">
            {formatCurrency(budget.totalSpent)} / {formatCurrency(budget.allocatedAmount)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => updateBudgetAmount(budget.id, budget.allocatedAmount)}
          >
            <AppIcons.edit className="w-4 h-4" />
          </button>
          {/* <span className="badge badge-sm badge-outline">
            {getRecurrenceLabel(budget.recurrence)}
          </span> */}
        </div>
      </div>

      <progress
        className={`progress w-full ${
          budget.percentUsed >= 100
            ? 'progress-error'
            : budget.percentUsed >= 50
            ? 'progress-warning'
            : 'progress-success'
        }`}
        value={budget.totalSpent}
        max={budget.allocatedAmount}
      />


      <div className="text-xs text-right text-base-content/50 mt-1">
        Remaining: {formatCurrency(budget.remainingAmount)}
      </div>
    </div>
  );
}
