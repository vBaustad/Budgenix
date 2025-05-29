import { useState } from 'react';
import { AppIcons } from '@/components/icons/AppIcons';
import InsightCard from './InsightCard';
import SectionShell from '@/components/layout/SectionShell';
import SpendingTrendChart from '@/components/common/charts/SpendingTrendChart';
import { StatCard } from '@/components/common/cards/StatCard';
import ProgressCard from '@/components/common/cards/ProgressCard';
import { formatCurrency } from '@/utils/formatting';
import { useCurrency } from '@/context/CurrencyContext';
import { useOverviewData } from '../hooks/useOverviewData';
import { useInsights } from '../hooks/useInsights';
import { InsightCategories } from '@/types/insights/insight';

export default function ExpensesOverview() {
  const { currency: userCurrency } = useCurrency();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1); // 1-based
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const isPast =
    selectedYear < now.getFullYear() ||
    (selectedYear === now.getFullYear() && selectedMonth < now.getMonth() + 1);

  const isFuture =
    selectedYear > now.getFullYear() ||
    (selectedYear === now.getFullYear() && selectedMonth > now.getMonth() + 1);

  const { insights, loading: insightsLoading } = useInsights(selectedMonth, selectedYear);
  const filteredInsights = insights.filter(i => i.category === InsightCategories.Expenses);

  const { data, loading } = useOverviewData(selectedMonth, selectedYear);

  const totalSpent = data?.totalSpent ?? 0;
  const lastMonthSpent = data?.lastMonthSpent ?? 0;
  const incomeReceived = data?.incomeReceived ?? 0;
  const upcomingRecurring = data?.upcomingRecurring ?? 0;
  const dailyTotals = data?.dailyTotals ?? [];

  const spendingDiff = totalSpent - lastMonthSpent;
  const spendingUp = spendingDiff > 0;
  const spendingPercent = Math.min((totalSpent / (lastMonthSpent || 1)) * 100, 200);

  const currentMonth = new Date(selectedYear, selectedMonth - 1).toLocaleString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col lg:flex-row justify-between gap-4">
      {/* LEFT SIDE: Overview */}
      <SectionShell
        title="Overview"
        icon={AppIcons.barChart}
        iconColor="text-base-content"
        background="bg-success/10"
        titleTextColor="text-base-content"
        extraHeaderContent={
          <div className="flex items-center gap-2">
            <p className="text-sm text-base-content/70 flex items-center gap-1">
              <AppIcons.calendar className="w-4 h-4 opacity-70" />
              {currentMonth}
            </p>
            <select
              className="select select-xs select-bordered"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString(undefined, { month: 'long' })}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={2000}
              max={2099}
              className="input input-xs input-bordered w-20"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            />
          </div>
        }
      >
        {/* Always render layout; fallback values if loading */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <StatCard
              icon={<AppIcons.expenses className="w-4 h-4" />}
              title="Spent"
              value={
                loading ? 'Loading...' : formatCurrency(totalSpent, userCurrency)
              }
              valueColor={loading ? 'text-base-content/40' : 'text-error'}
              diff={
                loading ? (
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
              value={loading ? 'Loading...' : formatCurrency(incomeReceived, userCurrency)}
              valueColor={loading ? 'text-base-content/40' : 'text-success'}
            />

            <StatCard
              icon={<AppIcons.recurring className="w-4 h-4" />}
              title="Upcoming Recurring"
              value={loading ? 'Loading...' : formatCurrency(upcomingRecurring, userCurrency)}
              valueColor={loading ? 'text-base-content/40' : 'text-warning'}
            />

            <ProgressCard
              label="Spending compared to last month"
              valueText={
                loading ? (
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
              percent={loading ? 0 : spendingPercent}
              colorClass={
                loading
                  ? 'bg-base-200 text-base-content/40'
                  : spendingUp
                  ? 'text-error bg-error'
                  : 'text-success bg-success'
              }
            />
          </div>

          <div className="bg-base-100 rounded-xl p-4 shadow space-y-1">
            {loading ? (
              <div className="h-32 bg-base-200 rounded animate-pulse" />
            ) : (
              <SpendingTrendChart view="daily" highlightSpikes={true} data={dailyTotals} />
            )}
          </div>
        </div>
      </SectionShell>

      {/* RIGHT SIDE: Insights */}
      <SectionShell
        title="Insights"
        icon={AppIcons.lightBulb}
        iconColor="text-base-content"
        background="bg-success/10"
        titleTextColor="text-base-content"
      >
        <div className="flex-1 bg-base-100 w-full p-4 rounded-2xl shadow-md m-2 border border-primary">
          {isFuture || isPast ? (
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
      </SectionShell>
    </div>
  );
}
