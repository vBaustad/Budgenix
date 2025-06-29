import { AppIcons } from '@/components/icons/AppIcons';
import { StatCard } from '@/components/common/cards/StatCard';
import ProgressCard from '@/components/common/cards/ProgressCard';
import { formatCurrency } from '@/utils/formatting';
import { useCurrency } from '@/context/CurrencyContext';
import { useDateFilter } from '@/context/DateFilterContext';
import { useInsights } from '@/features/expenses/hooks/useInsights';
import { InsightCategories } from '@/types/insights/insight';
import InsightCard from '@/features/expenses/components/InsightCard';
import { useIncomesContext } from '../context/IncomesContext';
import IncomeMonthlyChart from './IncomeMonthlyChart';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function IncomeOverview() {
  const { t } = useTranslation();
  const now = new Date();
  const { currency: userCurrency } = useCurrency();
  const { selectedMonth, selectedYear } = useDateFilter();

  const isCurrentMonth =
    selectedYear === now.getFullYear() &&
    selectedMonth === now.getMonth() + 1;

  const {
    overview,
    overviewLoading,
    refreshOverview,
  } = useIncomesContext();

  useEffect(() => {
    refreshOverview();
  }, [refreshOverview, selectedMonth, selectedYear]);

  const { insights, loading: insightsLoading } = useInsights(selectedMonth, selectedYear);
  const filteredInsights = insights.filter(i => i.category === InsightCategories.Income);

  const incomeThisMonth = overview?.totalIncome ?? 0;
  const lastMonthIncome = overview?.lastMonthIncome ?? 0;

  const diff = incomeThisMonth - lastMonthIncome;
  const incomeUp = diff > 0;
  const diffPercent = Math.min((incomeThisMonth / (lastMonthIncome || 1)) * 100, 200);

  return (
    <div className="flex flex-col gap-4 w-full max-w-full overflow-hidden lg:flex-row">
      {/* LEFT Overview */}
      <div className="w-full lg:w-1/2 flex flex-col gap-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <StatCard
            icon={<AppIcons.income className="w-4 h-4" />}
            title={t('incomes.overview.incomeTitle')}
            value={
              overviewLoading ? t('shared.loading') : formatCurrency(incomeThisMonth, userCurrency)
            }
            valueColor={overviewLoading ? 'text-base-content/40' : 'text-success'}
          />

          <ProgressCard
            label={t('incomes.overview.comparedToLastMonth')}
            valueText={
              overviewLoading ? (
                <span className="text-base-content/40">{t('shared.loading')}</span>
              ) : incomeUp ? (
                <span className="flex items-center gap-1 text-success">
                  <AppIcons.arrowUp className="w-4 h-4" />
                  {t('incomes.overview.moreThanLastMonth', {
                    amount: formatCurrency(diff, userCurrency),
                  })}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-error">
                  <AppIcons.arrowDown className="w-4 h-4" />
                  {t('incomes.overview.lessThanLastMonth', {
                    amount: formatCurrency(Math.abs(diff), userCurrency),
                  })}
                </span>
              )
            }
            percent={overviewLoading ? 0 : diffPercent}
            colorClass={
              overviewLoading
                ? 'bg-base-100 text-base-content/40'
                : incomeUp
                ? 'text-success bg-success'
                : 'text-error bg-error'
            }
          />
        </div>

        <div className="bg-base-100 mt-4 shadow-md rounded-xl p-4 space-y-1">
          {overviewLoading ? (
            <div className="rounded animate-pulse h-32" />
          ) : (
            <IncomeMonthlyChart />
          )}
        </div>
      </div>

      {/* RIGHT: Insights */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="bg-base-100 rounded-2xl shadow-md p-4 h-full">
          {!isCurrentMonth ? (
            <p className="text-sm text-base-content/70 p-4">
              {t('incomes.insights.notCurrentMonth')}
            </p>
          ) : insightsLoading ? (
            <p className="text-sm text-base-content/70 p-4">{t('incomes.insights.loading')}</p>
          ) : (
            <InsightCard
              insights={filteredInsights.map((i) => ({
                icon: AppIcons[i.icon as keyof typeof AppIcons],
                title: i.title,
                message: i.message,
                status: i.status,
              }))}
            />
          )}
        </div>
      </div>
    </div>
  );
}
