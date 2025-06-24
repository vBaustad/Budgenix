import ExpensesOverview from '@/features/expenses/components/ExpensesOverview';
import AddExpenseForm from '@/features/expenses/components/AddExpenseForm';
import ExpensesList from '@/features/expenses/components/ExpensesList';
import GroupedExpensesList from '@/features/expenses/components/GroupedExpensesList';
import BreakdownPieChart from '@/components/common/charts/BreakdownPieChart';
import CategoryFilter from '@/components/common/filters/CategoryFilter';
import GroupByDropdown from '@/components/common/filters/GroupByDropdown';
import SectionShell from '@/components/layout/SectionShell';
import { AppIcons } from '@/components/icons/AppIcons';
import { GROUP_OPTIONS } from '@/features/expenses/constants/grouping';
import { useExpensesContext } from '@/features/expenses/context/ExpensesContext';
import { useCategories } from '@/context/CategoryContext';
import { t } from 'i18next';
import SpendingTrendChart from '@/components/common/charts/SpendingTrendChart';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useExpensesOverview } from '@/features/expenses/services/expensesService';
import { useDateFilter } from '@/context/DateFilterContext';

export default function ExpensesPage() {
  const {
    expenses,
    groupedExpenses,
    loading,
    groupBy,
    selectedCategories,
    setGroupBy,
    setSelectedCategories,
    handleAddExpense,
  } = useExpensesContext();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { selectedMonth, selectedYear } = useDateFilter();
  const { data: overview, isLoading: overviewLoading } = useExpensesOverview(selectedMonth, selectedYear);
  const { categories } = useCategories();
  const dailyTotals = overview?.dailyTotals ?? [];
  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const chartData =
    groupedExpenses.length > 0
      ? groupedExpenses.flatMap((g) => g.expenses)
      : expenses;

  return (
    <div className="flex flex-col gap-4 p-4 w-full max-w-full overflow-hidden">
      <ExpensesOverview />
      <div>
        <div className="bg-base-100 shadow-md rounded-xl p-4">
          {overviewLoading ? (
            <div className="rounded animate-pulse h-40 bg-base-200" />
          ) : (
            <SpendingTrendChart view="daily" highlightSpikes={true} data={dailyTotals} />
          )}
        </div>
      </div>

      <button
        className="btn btn-primary flex items-center gap-2"
        onClick={() => setIsAddModalOpen(true)}
      >
        <AppIcons.add className="w-4 h-4" />
        Add Expense
      </button>

      <div className="flex flex-col lg:flex-row w-full max-w-full gap-4">
        <SectionShell
          title={t('expenses.allExpenses')}
          icon={AppIcons.list}
          className="w-full"
          extraHeaderContent={
            <div className="flex flex-wrap gap-2 text-sm font-medium text-base-content">
              <CategoryFilter
                options={categoryOptions}
                selected={selectedCategories}
                onChange={setSelectedCategories}
              />
              <GroupByDropdown
                value={groupBy}
                onChange={setGroupBy}
                options={GROUP_OPTIONS}
              />
            </div>
          }
        >
          <div className="max-h-[600px] overflow-x-auto shadow-md">
            {loading ? (
              <p className="text-base-content/60">{t('shared.loading')}</p>
            ) : groupBy ? (
              <GroupedExpensesList data={groupedExpenses} groupBy={groupBy} />
            ) : (
              <ExpensesList expenses={expenses} />
            )}
          </div>
        </SectionShell>

        <SectionShell title="Spending by Category" icon={AppIcons.pieChart} className="w-full hidden sm:block">
          <div className="w-full overflow-x-auto">
            <BreakdownPieChart
              data={chartData}
              groupBy={(e) => e.categoryName || 'Uncategorized'}
              getValue={(e) => e.amount}
              height={400}
              width={700}
            />
          </div>
        </SectionShell>
      </div>

      {isAddModalOpen && (
        <Dialog open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-base-100 rounded-xl p-6 shadow-lg max-w-md w-full">
              <Dialog.Title className="text-lg font-bold mb-4">Add Expense</Dialog.Title>
              <AddExpenseForm
                onAdd={(expense) => {
                  handleAddExpense(expense);
                  setIsAddModalOpen(false);
                }}
              />
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="btn btn-sm mt-4 w-full"
              >
                Cancel
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </div>
  );
}
