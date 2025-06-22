import { useUser } from '@/context/UserContext';
import { DashboardSummary } from '@/types/finance/DashboardSummary';
import { format } from 'date-fns';
import { AlertTriangleIcon, CalendarDaysIcon, PlusIcon, SparklesIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardHeader({ summary }: { summary: DashboardSummary }) {
  const { user } = useUser();
  const today = format(new Date(), 'EEEE, MMMM d');

  return (
    <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-primary/20 to-secondary/10 shadow-xl flex flex-col gap-4">
      {/* Top Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-base-content mb-1">
            Welcome back, {user?.firstName ?? 'Friend'}
          </h1>
          <p className="text-base-content/70 text-lg">
            Budget with vision. Spend with power. Save with purpose.
          </p>
        </div>
        <div className="flex flex-col sm:items-end gap-1 text-sm text-base-content/80">
          <div className="flex items-center gap-1">
            <CalendarDaysIcon className="w-4 h-4 opacity-60" />
            <span>{today}</span>
          </div>
          <div className="flex items-center gap-1">
            {summary.budgetsNearLimit > 0 ? (
              <>
                <AlertTriangleIcon className="w-4 h-4 text-warning" />
                <span className="text-warning font-medium">
                  {summary.budgetsNearLimit} budget{summary.budgetsNearLimit > 1 ? 's' : ''} near limit
                </span>
              </>
            ) : (
              <span className="text-success">All budgets healthy</span>
            )}
          </div>
          <div className="opacity-60 text-xs">Last updated: {format(new Date(summary.lastUpdated), 'PPpp')}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap relative z-10">
        <Link to="/expenses" className="btn btn-primary btn-sm gap-2">
          <PlusIcon className="w-4 h-4" /> Add Expense
        </Link>
        <Link to="/income" className="btn btn-accent btn-sm gap-2">
          <PlusIcon className="w-4 h-4" /> Add Income
        </Link>
        <Link to="/budgets" className="btn btn-secondary btn-sm gap-2">
          <PlusIcon className="w-4 h-4" /> Add Budget
        </Link>
        <Link to="/goals" className="btn btn-info btn-sm gap-2">
          <PlusIcon className="w-4 h-4" /> Add Goal
        </Link>
      </div>

      {/* Subtle background flair */}
      <div className="absolute right-0 bottom-0 opacity-10 text-[160px] text-primary-content pointer-events-none">
        <SparklesIcon className="w-full h-full" />
      </div>
    </div>
  );
}
