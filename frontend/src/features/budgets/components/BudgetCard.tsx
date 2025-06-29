import { BudgetProgressDto } from '@/types/finance/budget';
import { AppIcons } from '@/components/icons/AppIcons';
import { formatCurrency } from '@/utils/formatting';
import { useBudgets } from '../context/BudgetsContext';
import { useTranslation } from 'react-i18next';

type Props = {
  budget: BudgetProgressDto;
};

export default function BudgetCard({ budget }: Props) {
  const { openEditModal } = useBudgets();
  const { t } = useTranslation();

  const progressClass =
    budget.percentUsed >= 100
      ? 'progress-error'
      : budget.percentUsed >= 50
      ? 'progress-warning'
      : 'progress-success';

  const getRecurrenceLabel = (recurrence: string) =>
    t(`shared.recurrence.${recurrence}`);

  return (
    <div className="card bg-base-100 shadow-xl p-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-medium text-xl flex items-center gap-2">
            {budget.name}
          </h2>
          <div className="flex gap-1 mt-1">
            <span
              className="badge badge-sm badge-neutral tooltip"
              data-tip={budget.categoryName}
            >
              {budget.categoryName}
            </span>
            <span
              className="badge badge-sm badge-neutral tooltip"
              data-tip={getRecurrenceLabel(budget.recurrence)}
            >
              {getRecurrenceLabel(budget.recurrence)}
            </span>
          </div>
        </div>
        <button
          className="btn btn-xs btn-ghost"
          onClick={() => openEditModal(budget.id)}
        >
          <AppIcons.edit className="w-4 h-4" />
        </button>
      </div>
      <div>
        <progress
          className={`progress w-full ${progressClass}`}
          value={budget.totalSpent}
          max={budget.allocatedAmount}
        />
        <div className="flex justify-between text-xs mt-1">
          <span>
            {formatCurrency(budget.totalSpent)} /{' '}
            {formatCurrency(budget.allocatedAmount)}
          </span>
          <span className="text-base-content/50">
            {t('budgets.card.remaining')}: {formatCurrency(budget.remainingAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
