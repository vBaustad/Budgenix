import { AppIcons } from '@/components/icons/AppIcons';
import { formatCurrency } from '@/utils/formatting';
import { useCurrency } from '@/context/CurrencyContext';
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

  const { data: overview, isLoading: overviewLoading } = useExpensesOverview(selectedMonth, selectedYear);
  const { data: recurringOverview } = useRecurringOverview(selectedMonth, selectedYear);
  const totalSpent = overview?.totalSpent ?? 0;
  const lastMonthSpent = overview?.lastMonthSpent ?? 0;
  const upcomingRecurringExpenseTotal = recurringOverview?.upcomingRecurringExpenseTotal ?? 0; 
  const spendingDiff = totalSpent - lastMonthSpent;
  const spendingUp = spendingDiff > 0;

  // const { insights, loading: insightsLoading } = useInsights(selectedMonth, selectedYear);
  // const filteredInsights = insights.filter(i => i.category === InsightCategories.Expenses);
  // const spendingPercent = Math.min((totalSpent / (lastMonthSpent || 1)) * 100, 200);
  // const incomeReceived = overview?.incomeReceived ?? 0;
  // const dailyTotals = overview?.dailyTotals ?? [];

  //Calculate avg daily spend
  const today = new Date();
  const isThisMonth = selectedYear === today.getFullYear() && selectedMonth === today.getMonth() + 1;
  const daysSoFar = isThisMonth ? today.getDate() : new Date(selectedYear, selectedMonth, 0).getDate(); 
  const avgDailySpend = totalSpent / (daysSoFar || 1);

  return (
    <div className="flex flex-col gap-4 w-full max-w-full overflow-hidden">
      {/* Summary bar */}
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-base-100 p-6 rounded-xl shadow items-center">
        <div className="flex items-center gap-4">
          <AppIcons.expenses className="w-6 h-6 text-error" />
          <div>
            <div className="text-sm text-base-content/70">Spent</div>
            <div className="text-xl font-semibold">
              {overviewLoading ? 'Loading...' : formatCurrency(totalSpent, userCurrency)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <AppIcons.recurring className="w-6 h-6 text-warning" />
          <div>
            <div className="text-sm text-base-content/70">Upcoming</div>
            <div className="text-xl font-semibold">
              {isCurrentMonth
                ? overviewLoading
                  ? 'Loading...'
                  : formatCurrency(upcomingRecurringExpenseTotal, userCurrency)
                : 'N/A'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <AppIcons.growth className="w-6 h-6 text-info" />
          <div>
            <div className="text-sm text-base-content/70">Vs Last Month</div>
            <div
              className={`text-xl font-semibold ${
                spendingUp ? 'text-error' : 'text-success'
              }`}
            >
              {overviewLoading
                ? 'Loading...'
                : spendingUp
                ? `+${formatCurrency(spendingDiff, userCurrency)}`
                : `-${formatCurrency(Math.abs(spendingDiff), userCurrency)}`}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <AppIcons.lineChart className="w-6 h-6 text-primary" />
          <div>
            <div className="text-sm text-base-content/70">Avg Daily Spend</div>
            <div className="text-xl font-semibold">
              {overviewLoading
                ? 'Loading...'
                : formatCurrency(avgDailySpend, userCurrency)}
            </div>
          </div>
        </div>
      </div>


      {/* RIGHT SIDE: Insights */}
      {/* <div className="w-full lg:w-1/2 flex flex-col">
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
      </div> */}
    </div>
  );
}
