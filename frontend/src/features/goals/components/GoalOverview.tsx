import { AppIcons } from '@/components/icons/AppIcons';
import { useCurrency } from '@/context/CurrencyContext';
import { GoalDto } from '@/types/finance/goal';
import { formatCurrency } from '@/utils/formatting';
import { useTranslation } from 'react-i18next';

type Props = {
  goals: GoalDto[];
};

export default function GoalOverview({ goals }: Props) {
  const { t } = useTranslation();
  const { currency } = useCurrency();

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const remaining = totalTarget - totalSaved;
  const isOver = remaining < 0;

  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-base-100 p-6 rounded-xl shadow items-center">
      <div className="flex items-center gap-4">
        <AppIcons.savings className="w-6 h-6 text-primary" />
        <div>
          <div className="text-sm text-base-content/70">{t('goals.overview.target')}</div>
          <div className="text-xl font-semibold">
            {formatCurrency(totalTarget, currency)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <AppIcons.arrowDown className="w-6 h-6 text-success" />
        <div>
          <div className="text-sm text-base-content/70">{t('goals.overview.saved')}</div>
          <div className="text-xl font-semibold">
            {formatCurrency(totalSaved, currency)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <AppIcons.arrowDown
          className={`w-6 h-6 ${isOver ? 'text-error' : 'text-warning'}`}
        />
        <div>
          <div className="text-sm text-base-content/70">{t('goals.overview.remaining')}</div>
          <div className={`text-xl font-semibold ${isOver ? 'text-error' : 'text-warning'}`}>
            {formatCurrency(remaining, currency)}
          </div>
        </div>
      </div>
    </div>
  );
}
