'use client';

import { useTranslation } from 'react-i18next';
import { AppIcons } from '@/components/icons/AppIcons';
import { formatCurrency } from '@/utils/formatting';
import { useCurrency } from '@/context/CurrencyContext';

type Props = {
  totalIncome: number;
  lastMonthIncome: number;
  annualIncome: number;
  avgMonthly: number;
  loading?: boolean;
};

export default function IncomeOverviewStats({
  totalIncome,
  lastMonthIncome,
  annualIncome,
  avgMonthly,
  loading,
}: Props) {
  const { t } = useTranslation();
  const { currency: userCurrency } = useCurrency();

  return (
    <div className="overflow-hidden bg-base-100 mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-base-300 p-6 items-center text-sm">
        {/* Total Income (This Month) */}
        <div className="flex items-center gap-4 px-4">
          <AppIcons.income className="w-6 h-6 text-success" />
          <div>
            <div className="text-base-content/70">{t('incomes.overview.incomeTitle')}</div>
            <div className="text-xl font-semibold">
              {loading ? t('shared.loading') : formatCurrency(totalIncome, userCurrency)}
            </div>
          </div>
        </div>

        {/* Last Month Income */}
        <div className="flex items-center gap-4 px-4">
          <AppIcons.arrowLeft className="w-6 h-6 text-accent" />
          <div>
            <div className="text-base-content/70">{t('incomes.overview.lastMonthIncome')}</div>
            <div className="text-xl font-semibold">
              {loading ? t('shared.loading') : formatCurrency(lastMonthIncome, userCurrency)}
            </div>
          </div>
        </div>

        {/* Annual Income */}
        <div className="flex items-center gap-4 px-4">
          <AppIcons.lineChart className="w-6 h-6 text-info" />
          <div>
            <div className="text-base-content/70">{t('incomes.overview.annualIncome')}</div>
            <div className="text-xl font-semibold">
              {loading ? t('shared.loading') : formatCurrency(annualIncome, userCurrency)}
            </div>
          </div>
        </div>

        {/* Avg Monthly */}
        <div className="flex items-center gap-4 px-4">
          <AppIcons.growth className="w-6 h-6 text-primary" />
          <div>
            <div className="text-base-content/70">{t('incomes.overview.avgMonthly')}</div>
            <div className="text-xl font-semibold">
              {loading ? t('shared.loading') : formatCurrency(avgMonthly, userCurrency)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
