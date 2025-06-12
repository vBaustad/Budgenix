import { useEffect } from 'react';
import { AppIcons } from '@/components/icons/AppIcons';
import { StatCard } from '@/components/common/cards/StatCard';
import ProgressCard from '@/components/common/cards/ProgressCard';
import { formatCurrency } from '@/utils/formatting';
import { useCurrency } from '@/context/CurrencyContext';
import { useDateFilter } from '@/context/DateFilterContext';
import { useInsights } from '@/features/expenses/hooks/useInsights';
import { InsightCategories } from '@/types/insights/insight';
import InsightCard from '@/features/expenses/components/InsightCard';
import { useIncomes } from '../context/IncomesContext';
import IncomeMonthlyChart from './IncomeMonthlyChart';

export default function IncomeOverview() {
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
  } = useIncomes(); // assuming this returns same shape as expenses overview

  useEffect(() => {
    refreshOverview(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  const { insights, loading: insightsLoading } = useInsights(selectedMonth, selectedYear);
  const filteredInsights = insights.filter(i => i.category === InsightCategories.Income);

  const incomeThisMonth = overview?.totalIncome ?? 0;
  const lastMonthIncome = overview?.lastMonthIncome ?? 0;

  const diff = incomeThisMonth - lastMonthIncome;
  const incomeUp = diff > 0;
  const diffPercent = Math.min((incomeThisMonth / (lastMonthIncome || 1)) * 100, 200);

  return (
    <div className="flex flex-col lg:flex-row justify-between gap-4 p-2">
      {/* LEFT Overview */}
      <div className="w-full flex flex-col gap-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <StatCard
            icon={<AppIcons.income className="w-4 h-4" />}
            title="Income"
            value={
              overviewLoading ? 'Loading...' : formatCurrency(incomeThisMonth, userCurrency)
            }
            valueColor={overviewLoading ? 'text-base-content/40' : 'text-success'}
          />         

          <ProgressCard
            label="Compared to last month"
            valueText={
              overviewLoading ? (
                <span className="text-base-content/40">Loading...</span>
              ) : incomeUp ? (
                <span className="flex items-center gap-1 text-success">
                  <AppIcons.arrowUp className="w-4 h-4" />
                  {formatCurrency(diff, userCurrency)} more than last month
                </span>
              ) : (
                <span className="flex items-center gap-1 text-error">
                  <AppIcons.arrowDown className="w-4 h-4" />
                  {formatCurrency(Math.abs(diff), userCurrency)} less than last month
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
      <div className="w-full flex">
        <div className="flex-1 bg-base-200 rounded-2xl shadow-md">
          {!isCurrentMonth ? (
            <p className="text-sm text-base-content/70 p-4">
              Insights are only available for the current month.
            </p>
          ) : insightsLoading ? (
            <p className="text-sm text-base-content/70 p-4">Loading insights...</p>
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
