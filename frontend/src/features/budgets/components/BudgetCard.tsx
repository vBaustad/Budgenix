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

  const gradientBackgrounds = [
    'from-green-100 to-green-200',
    'from-indigo-100 to-indigo-200',
    'from-amber-100 to-amber-200',
    'from-pink-100 to-pink-200',
    'from-sky-100 to-sky-200',
    'from-emerald-100 to-emerald-200',
  ];


  function getGradientClassFromId(id: string) {
    const index = [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % gradientBackgrounds.length;
    return `bg-gradient-to-br ${gradientBackgrounds[index]}`;
  }
  return (
    <div
      className={`rounded-xl border border-base-300 p-4 space-y-4 transition hover:shadow-md ${getGradientClassFromId(
        budget.id
      )}`}
>
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-base font-semibold">
            <AppIcons.wallet className="w-5 h-5 text-primary" />
            <span>{budget.name}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            <span className="badge badge-sm bg-base-200 text-base-content/80">
              {budget.categoryName}
            </span>
            <span className="badge badge-sm bg-base-200 text-base-content/80">
              {getRecurrenceLabel(budget.recurrence)}
            </span>
          </div>
        </div>
        <button
          className="btn btn-xs btn-ghost text-base-content/70 hover:text-primary"
          onClick={() => openEditModal(budget.id)}
        >
          <AppIcons.edit className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium text-base-content/70">
          <span>{t('budgets.card.remaining')}</span>
          <span
            className={
              budget.remainingAmount < 0 ? 'text-error' : 'text-success'
            }
          >
            {formatCurrency(budget.remainingAmount)}
          </span>
        </div>

        <progress
          className={`progress w-full ${progressClass}`}
          value={budget.totalSpent}
          max={budget.allocatedAmount}
        />

        <div className="flex justify-between text-xs text-base-content/60">
          <span>
            {formatCurrency(budget.totalSpent)} /{' '}
            {formatCurrency(budget.allocatedAmount)}
          </span>
          <span>{Math.round(budget.percentUsed)}%</span>
        </div>
      </div>
    </div>
  );
}

