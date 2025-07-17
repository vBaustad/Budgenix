'use client';

import { AppIcons } from '@/components/icons/AppIcons';
import { formatCurrency } from '@/utils/formatting';
import { useCurrency } from '@/context/CurrencyContext';
import { useDateFilter } from '@/context/DateFilterContext';
import { useExpensesOverview } from '@/features/expenses/services/expensesService';
import { useRecurringOverview } from '@/features/recurring/services/recurringService';
import { useTranslation } from 'react-i18next';

export default function ExpensesOverview() {
  const { t } = useTranslation();
  const { currency: userCurrency } = useCurrency();
  const { selectedMonth, selectedYear } = useDateFilter();
  const now = new Date();

  const isCurrentMonth =
    selectedYear === now.getFullYear() && selectedMonth === now.getMonth() + 1;

  const { data: overview, isLoading: overviewLoading } = useExpensesOverview(
    selectedMonth,
    selectedYear
  );
  const { data: recurringOverview } = useRecurringOverview(selectedMonth, selectedYear);

  const totalSpent = overview?.totalSpent ?? 0;
  const lastMonthSpent = overview?.lastMonthSpent ?? 0;
  const upcomingRecurringExpenseTotal = recurringOverview?.upcomingRecurringExpenseTotal ?? 0;
  const spendingDiff = totalSpent - lastMonthSpent;
  const spendingUp = spendingDiff > 0;

  const today = new Date();
  const isThisMonth =
    selectedYear === today.getFullYear() && selectedMonth === today.getMonth() + 1;
  const daysSoFar = isThisMonth
    ? today.getDate()
    : new Date(selectedYear, selectedMonth, 0).getDate();

  const avgDailySpend = totalSpent / (daysSoFar || 1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-base-300 bg-base-100 p-6 rounded-xl overflow-hidden">
      {/* Spent */} 
      <div className="flex items-center gap-4 px-4 py-3">
        <AppIcons.expenses className="w-6 h-6 text-error" />
        <div>
          <div className="text-sm text-base-content/70">{t('expenses.overview.spent')}</div>
          <div className="text-xl font-semibold">
            {overviewLoading ? t('shared.loading') : formatCurrency(totalSpent, userCurrency)}
          </div>
        </div>
      </div>

      {/* Upcoming Recurring */}
      <div className="flex items-center gap-4 px-4 py-3">
        <AppIcons.recurring className="w-6 h-6 text-warning" />
        <div>
          <div className="text-sm text-base-content/70">{t('expenses.overview.upcoming')}</div>
          <div className="text-xl font-semibold">
            {isCurrentMonth
              ? overviewLoading
                ? t('shared.loading')
                : formatCurrency(upcomingRecurringExpenseTotal, userCurrency)
              : 'N/A'}
          </div>
        </div>
      </div>

      {/* Vs Last Month */}
      <div className="flex items-center gap-4 px-4 py-3">
        <AppIcons.growth className="w-6 h-6 text-info" />
        <div>
          <div className="text-sm text-base-content/70">{t('expenses.overview.vsLastMonth')}</div>
          <div
            className={`text-xl font-semibold ${
              spendingUp ? 'text-error' : 'text-success'
            }`}
          >
            {overviewLoading
              ? t('shared.loading')
              : spendingUp
              ? `+${formatCurrency(spendingDiff, userCurrency)}`
              : `-${formatCurrency(Math.abs(spendingDiff), userCurrency)}`}
          </div>
        </div>
      </div>

      {/* Avg Daily Spend */}
      <div className="flex items-center gap-4 px-4 py-3">
        <AppIcons.lineChart className="w-6 h-6 text-primary" />
        <div>
          <div className="text-sm text-base-content/70">
            {t('expenses.overview.avgDailySpend')}
          </div>
          <div className="text-xl font-semibold">
            {overviewLoading ? t('shared.loading') : formatCurrency(avgDailySpend, userCurrency)}
          </div>
        </div>
      </div>
    </div>

  );
}
