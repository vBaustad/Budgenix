import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { DashboardSummary } from '@/types/finance/DashboardSummary';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import AddGoalModal from '@/features/goals/components/AddGoalModal';
import AddExpenseModal from '@/features/expenses/components/AddExpenseModal';
import AddBudgetModal from '@/features/budgets/components/AddBudgetModal';
import { AppIcons } from '@/components/icons/AppIcons';
import { useTranslation } from 'react-i18next';
import { useExpensesContext } from '@/features/expenses/context/ExpensesContext';

export default function DashboardHeader({ summary }: { summary: DashboardSummary }) {
  const { t } = useTranslation();
  const { user } = useUser();
  const { handleAddExpense } = useExpensesContext();
  const today = format(new Date(), 'EEEE, MMMM d');

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-primary/30 to-secondary/20 shadow-2xl flex flex-col gap-6 border border-primary/20">
      <AppIcons.sparkles className="absolute opacity-5 text-base-content right-[-60px] bottom-[-60px] w-[400px] h-[400px] transform rotate-12 pointer-events-none" />

      {/* Top Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-base-content mb-2 tracking-tight">
            {t('dashboard.welcome', { name: user?.firstName ?? t('dashboard.fallbackName') })}
          </h1>
          <p className="text-base-content/70 text-lg italic">
            {t('dashboard.subtitle')}
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
                  {t('dashboard.budgets.nearLimit', { count: summary.budgetsNearLimit })}
                </span>
              </>
            ) : (
              <span className="text-success font-medium">
                {t('dashboard.budgets.healthy')}
              </span>
            )}
          </div>
          <div className="opacity-80 text-xs">
            {t('dashboard.lastUpdated')}: {format(new Date(summary.lastUpdated), 'PPpp')}
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex gap-3 flex-wrap relative z-10">
        <button onClick={() => setShowAddExpense(true)} className="btn btn-primary btn-sm shadow-md gap-2">
          <AppIcons.add className="w-4 h-4" /> {t('buttons.addExpense')}
        </button>
        <Link to="/income" className="btn btn-accent btn-sm shadow-md gap-2">
          <AppIcons.add className="w-4 h-4" /> {t('buttons.addIncome')}
        </Link>
        <button onClick={() => setShowAddBudget(true)} className="btn btn-secondary btn-sm shadow-md gap-2">
          <AppIcons.add className="w-4 h-4" /> {t('buttons.addBudget')}
        </button>
        <button onClick={() => setShowAddGoal(true)} className="btn btn-info btn-sm shadow-md gap-2">
          <AppIcons.add className="w-4 h-4" /> {t('buttons.addGoal')}
        </button>
      </div>

      {/* Modals */}
      {showAddGoal && <AddGoalModal onClose={() => setShowAddGoal(false)} />}
      {showAddExpense && (
        <AddExpenseModal
          onClose={() => setShowAddExpense(false)}
          onAdd={(expense) => {
            handleAddExpense(expense);
            setShowAddExpense(false);
          }}
        />
      )}
      {showAddBudget && <AddBudgetModal onClose={() => setShowAddBudget(false)} />}
    </div>
  );
}
