import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { DashboardSummary } from '@/types/finance/DashboardSummary';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import AddGoalModal from '@/features/goals/components/AddGoalModal';
import { AppIcons } from '@/components/icons/AppIcons';

export default function DashboardHeader({ summary }: { summary: DashboardSummary }) {
  const { user } = useUser();
  const today = format(new Date(), 'EEEE, MMMM d');
  const [showAddGoal, setShowAddGoal] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-primary/30 to-secondary/20 shadow-2xl flex flex-col gap-6 border border-primary/20">
      
      {/* BIG faint watermark icon */}
      <AppIcons.sparkles className="absolute opacity-5 text-base-content right-[-60px] bottom-[-60px] w-[400px] h-[400px] transform rotate-12 pointer-events-none" />

      {/* Top Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-base-content mb-2 tracking-tight">
            Welcome back, {user?.firstName ?? 'Friend'}
          </h1>
          <p className="text-base-content/70 text-lg italic">
            Budget with vision. Spend with power. Save with purpose.
          </p>
        </div>
        <div className="flex flex-col sm:items-end gap-1 text-sm text-base-content/80">
          <div className="flex items-center gap-1">
            <AppIcons.calendar className="w-4 h-4 opacity-80" />
            <span>{today}</span>
          </div>
          <div className="flex items-center gap-1">
            {summary.budgetsNearLimit > 0 ? (
              <>
                <AppIcons.warning className="w-4 h-4 text-warning" />
                <span className="text-warning font-medium">
                  {summary.budgetsNearLimit} budget{summary.budgetsNearLimit > 1 ? 's' : ''} near limit
                </span>
              </>
            ) : (
              <span className="text-success font-medium">All budgets healthy</span>
            )}
          </div>
          <div className="opacity-80 text-xs">Last updated: {format(new Date(summary.lastUpdated), 'PPpp')}</div>
        </div>
      </div>

      {/* Buttons Row */}
      <div className="flex gap-3 flex-wrap relative z-10">
        <Link to="/expenses" className="btn btn-primary btn-sm shadow-md gap-2">
          <AppIcons.add className="w-4 h-4" /> Add Expense
        </Link>
        <Link to="/income" className="btn btn-accent btn-sm shadow-md gap-2">
          <AppIcons.add className="w-4 h-4" /> Add Income
        </Link>
        <Link to="/budgets" className="btn btn-secondary btn-sm shadow-md gap-2">
          <AppIcons.add className="w-4 h-4" /> Add Budget
        </Link>
        <button onClick={() => setShowAddGoal(true)} className="btn btn-info btn-sm shadow-md gap-2">
          <AppIcons.add className="w-4 h-4" /> Add Goal
        </button>
      </div>

      {/* Add Goal Modal */}
      {showAddGoal && (
        <AddGoalModal onClose={() => setShowAddGoal(false)} />
      )}
    </div>
  );
}
