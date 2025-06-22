import { AppIcons } from '@/components/icons/AppIcons';
import InsightCard from './InsightCard';
import SpendingTrendChart from '@/components/common/charts/SpendingTrendChart';
import { StatCard } from '@/components/common/cards/StatCard';
import ProgressCard from '@/components/common/cards/ProgressCard';
import { formatCurrency } from '@/utils/formatting';
import { useCurrency } from '@/context/CurrencyContext';
import { useInsights } from '../hooks/useInsights';
import { InsightCategories } from '@/types/insights/insight';
import { useDateFilter } from '@/context/DateFilterContext';
import { useExpensesOverview } from '@/features/expenses/services/expensesService';
import { useRecurringOverview } from '@/features/recurring/services/recurringService';

export default function ExpensesOverview() {
  const { currency: userCurrency } = useCurrency();
  const now = new Date();
  const { selectedMonth, selectedYear } = useDateFilter();

  const isCurrentMonth =
    selectedYear === now.getFullYear() &&
    selectedMonth === now.getMonth() + 1;

  const { insights, loading: insightsLoading } = useInsights(selectedMonth, selectedYear);
  const filteredInsights = insights.filter(i => i.category === InsightCategories.Expenses);

  const { data: overview, isLoading: overviewLoading } = useExpensesOverview(selectedMonth, selectedYear);
  const { data: recurringOverview } = useRecurringOverview(selectedMonth, selectedYear);

  const totalSpent = overview?.totalSpent ?? 0;
  const lastMonthSpent = overview?.lastMonthSpent ?? 0;
  const incomeReceived = overview?.incomeReceived ?? 0;
  const upcomingRecurringExpenseTotal = recurringOverview?.upcomingRecurringExpenseTotal ?? 0;
  const dailyTotals = overview?.dailyTotals ?? [];

  const spendingDiff = totalSpent - lastMonthSpent;
  const spendingUp = spendingDiff > 0;
  const spendingPercent = Math.min((totalSpent / (lastMonthSpent || 1)) * 100, 200);

  return (
    <div className="flex flex-col gap-4 w-full max-w-full overflow-hidden lg:flex-row">
      {/* LEFT SIDE: Overview */}
      <div className="w-full lg:w-1/2 flex flex-col gap-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <StatCard
            icon={<AppIcons.expenses className="w-4 h-4" />}
            title="Spent"
            value={overviewLoading ? 'Loading...' : formatCurrency(totalSpent, userCurrency)}
            valueColor={overviewLoading ? 'text-base-content/40' : 'text-error'}
            diff={
              overviewLoading ? (
                <span className="text-base-content/40">...</span>
              ) : spendingUp ? (
                <span className="flex items-center gap-1 text-error">
                  <AppIcons.arrowUp className="w-4 h-4" />
                  +{formatCurrency(spendingDiff, userCurrency)}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-success">
                  <AppIcons.arrowDown className="w-4 h-4" />
                  –{formatCurrency(Math.abs(spendingDiff), userCurrency)}
                </span>
              )
            }
          />
          <StatCard
            icon={<AppIcons.income className="w-4 h-4" />}
            title="Income"
            value={overviewLoading ? 'Loading...' : formatCurrency(incomeReceived, userCurrency)}
            valueColor={overviewLoading ? 'text-base-content/40' : 'text-success'}
          />
          <StatCard
            icon={<AppIcons.recurring className="w-4 h-4" />}
            title="Upcoming Expenses"
            value={
              isCurrentMonth
                ? overviewLoading
                  ? 'Loading...'
                  : formatCurrency(upcomingRecurringExpenseTotal, userCurrency)
                : 'Only shown for current month'
            }
            valueColor={
              isCurrentMonth
                ? overviewLoading
                  ? 'text-base-content/40'
                  : 'text-warning'
                : 'text-base-content/60 italic'
            }
          />
          <ProgressCard
            label="Spending compared to last month"
            valueText={
              overviewLoading ? (
                <span className="text-base-content/40">Loading...</span>
              ) : spendingUp ? (
                <span className="flex items-center gap-1 text-error">
                  <AppIcons.arrowUp className="w-4 h-4" />
                  {formatCurrency(spendingDiff, userCurrency)} more than last month
                </span>
              ) : (
                <span className="flex items-center gap-1 text-success">
                  <AppIcons.arrowDown className="w-4 h-4" />
                  {formatCurrency(Math.abs(spendingDiff), userCurrency)} below last month
                </span>
              )
            }
            percent={overviewLoading ? 0 : spendingPercent}
            colorClass={
              overviewLoading
                ? 'bg-base-100 text-base-content/40'
                : spendingUp
                ? 'text-error bg-error'
                : 'text-success bg-success'
            }
          />
        </div>

        <div className="bg-base-100 mt-2 shadow-md rounded-xl p-10 space-y-1 overflow-x-auto">
          {overviewLoading ? (
            <div className="rounded animate-pulse h-40 bg-base-200" />
          ) : (
            <SpendingTrendChart view="daily" highlightSpikes={true} data={dailyTotals} />
          )}
        </div>
      </div>

      {/* RIGHT SIDE: Insights */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="bg-base-100 rounded-2xl shadow-md p-4 h-full">
          {!isCurrentMonth ? (
            <p className="text-sm text-base-content/70">
              Insights are only available for the current month.
            </p>
          ) : insightsLoading ? (
            <p className="text-sm text-base-content/70">Loading insights...</p>
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
