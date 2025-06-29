import { useDashboardSummary } from '@/features/dashboard/hooks/useDashboardSummary';
import DashboardCard from '@/features/dashboard/components/DashboardCard';
import { AppIcons } from '@/components/icons/AppIcons';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import DashboardHeader from '@/features/dashboard/components/DashboardHeader';
import RecentActivity from '@/features/dashboard/components/RecentActivity';
import DashboardInsights from '@/features/dashboard/components/DashboardInsights';

export default function DashboardPage() {
  const { data: summary, isLoading } = useDashboardSummary();

  if (isLoading || !summary) return <LoadingSpinner />;

  return (
    <div className="p-6 space-y-6 mx-auto">
      <DashboardHeader summary={summary} />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <DashboardCard
          title="Expenses This Month"
          value={summary.totalSpentThisMonth}
          showCurrency
          icon={<AppIcons.wallet className="w-6 h-6 text-red-400" />}
          to="/expenses"
          bg="from-red-500/50 to-red-900/70"
          border="border-red-500/20"
          progress={summary.spendingIsUp ? 80 : 50}
        />

        <DashboardCard
          title="Income Received"
          value={summary.incomeReceivedThisMonth}
          showCurrency
          icon={<AppIcons.income className="w-6 h-6 text-green-400" />}
          to="/income"
          bg="from-green-500/50 to-green-900/70"
          border="border-green-500/20"
          progress={100}
        />

        <DashboardCard
          title="Active Budgets"
          value={summary.activeBudgets}
          suffix={summary.activeBudgets ? 'active' : ''}
          icon={<AppIcons.landmark className="w-6 h-6 text-blue-400" />}
          to="/budgets"
          bg="from-blue-500/50 to-blue-900/70"
          border="border-blue-500/20"
          progress={
            summary.activeBudgets && summary.budgetAllocatedTotal
              ? Math.min((summary.budgetSpentTotal / summary.budgetAllocatedTotal) * 100, 100)
              : 0
          }
          emptyMessage={summary.activeBudgets === 0 ? 'Create your first budget' : undefined}
        />

        <DashboardCard
          title="Savings Total"
          value={summary.totalSavings}
          showCurrency
          icon={<AppIcons.savings className="w-6 h-6 text-orange-300" />}
          to="/goals"
          bg="from-orange-500/50 to-orange-900/70"
          border="border-orange-500/20"
          progress={summary.totalSavings > 0 ? 75 : 0}
          emptyMessage={summary.totalSavings === 0 ? 'Start saving today!' : undefined}
        />

        <DashboardCard
          title="Financial Goals"
          value={summary.totalGoals}
          suffix={summary.totalGoals ? 'Goals' : ''}
          icon={<AppIcons.goal className="w-6 h-6 text-pink-400" />}
          to="/goals"
          bg="from-pink-500/50 to-pink-900/70"
          border="border-pink-500/20"
          progress={
            summary.totalGoals
              ? Math.min((summary.goalsNearCompletion / summary.totalGoals) * 100, 100)
              : 0
          }
          emptyMessage={summary.totalGoals === 0 ? 'Set up your first goal' : undefined}
        />

        <DashboardCard
          title="Cashflow Stats"
          value={0}
          icon={<AppIcons.goal className="w-6 h-6 text-purple-400" />}
          to="/cashflow"
          bg="from-purple-500/50 to-purple-900/70"
          border="border-purple-500/20"
          progress={0}
          emptyMessage="Cashflow stats coming soon"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <DashboardInsights />
        <RecentActivity />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="bg-base-100 border border-base-200 rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Upcoming Events</h2>
          <ul className="space-y-2 text-sm text-base-content/80">
            <li>📅 Rent payment scheduled in 3 days</li>
            <li>📅 Credit card bill due in 5 days</li>
          </ul>
        </div>

        <div className="bg-base-100 border border-base-200 rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Suggestions</h2>
          <ul className="space-y-2 text-sm text-base-content/80">
            <li>💡 Consider reducing dining out — 15% of spending.</li>
            <li>💡 You could save an extra 500 kr by cancelling unused subscriptions.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
