import { useDashboardSummary } from '@/features/dashboard/hooks/useDashboardSummary';
import DashboardCard from '@/features/dashboard/components/DashboardCard';
import { AppIcons } from '@/components/icons/AppIcons';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function DashboardPage() {
  const { data: summary, isLoading } = useDashboardSummary();

  if (isLoading || !summary) return <LoadingSpinner />;

  return (
  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
    <DashboardCard
      title="Expenses This Month"
      value={summary.totalSpentThisMonth}
      showCurrency
      icon={<AppIcons.wallet className="w-6 h-6 text-red-400" />}
      to="/expenses"
      bg="from-red-500/50 to-red-900/70"
      border="border-red-500/20"
      progress={summary.spendingIsUp ? 80 : 50} // Example: tweak logic if needed
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
      suffix={summary.activeBudgets > 0 ? "active" : ""}
      icon={<AppIcons.landmark className="w-6 h-6 text-blue-400" />}
      to="/budgets"
      bg="from-blue-500/50 to-blue-900/70"
      border="border-blue-500/20"
      progress={summary.activeBudgets > 0 ? Math.min((summary.budgetSpentTotal / summary.budgetAllocatedTotal) * 100, 100) : 0}
      emptyMessage={summary.activeBudgets === 0 ? "Create your first budget" : undefined}
    />
    <DashboardCard
      title="Savings Total"
      value={summary.totalSavings}
      showCurrency
      icon={<AppIcons.savings className="w-6 h-6 text-orange-300" />}
      to="/goals"
      bg="from-orange-500/50 to-orange-900/70"
      border="border-orange-500/20"
      progress={summary.totalSavings > 0 ? 75 : 0} // Example % or computed
      emptyMessage={summary.totalSavings === 0 ? "Start saving today!" : undefined}
    />
    <DashboardCard
      title="Financial Goals"
      value={summary.totalGoals}
      suffix="Goals"
      icon={<AppIcons.goal className="w-6 h-6 text-pink-400" />}
      to="/goals"
      bg="from-pink-500/50 to-pink-900/70"
      border="border-pink-500/20"
      progress={summary.totalGoals > 0 ? Math.min((summary.goalsNearCompletion / summary.totalGoals) * 100, 100) : 0}
      emptyMessage={summary.totalGoals === 0 ? "Set up your first goal" : undefined}
    />
  </div>


    
  );
}
