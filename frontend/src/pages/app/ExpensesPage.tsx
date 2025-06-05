import ExpensesOverview from '@/features/expenses/components/ExpensesOverview';
import AddExpenseForm from '@/features/expenses/components/AddExpenseForm';
import ExpensesList from '@/features/expenses/components/ExpensesList';
import GroupedExpensesList from '@/features/expenses/components/GroupedExpensesList';
import UpcomingRecurringList from '@/features/recurring/components/UpcomingRecurringList';
import EditRecurringItemForm from '@/features/recurring/components/EditRecurringItemForm';
import BreakdownPieChart from '@/components/common/charts/BreakdownPieChart';
import CategoryFilter from '@/components/common/filters/CategoryFilter';
import GroupByDropdown from '@/components/common/filters/GroupByDropdown';
import SectionShell from '@/components/layout/SectionShell';
import { AppIcons } from '@/components/icons/AppIcons';
import { GROUP_OPTIONS } from '@/features/expenses/constants/grouping';
import RecurringSummary from '@/features/recurring/components/RecurringSummary';
import { useExpenses } from '@/context/ExpensesContext';
import { useRecurring } from '@/context/RecurringContext';
import { useCategories } from '@/context/CategoryContext';
import { t } from 'i18next';

export type GroupByOption = typeof GROUP_OPTIONS[number]['value'];

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
  } = useExpenses();

  const {
    recurringExpenses,
    loadingRecurring,
    refreshRecurring,
    selectedRecurringItem,
    setSelectedRecurringItem,
    monthlyRecurringTotal,
    lastTriggeredRecurring,
    lastSkippedRecurring,
  } = useRecurring();

  const { categories } = useCategories();

  const categoryOptions = categories.map((c) => ({
  value: c.id,
  label: c.name,
  }));

  const handleRecurringSave = async () => {
    setSelectedRecurringItem(null);
    await refreshRecurring();
  };

  const chartData = groupedExpenses.length > 0
    ? groupedExpenses.flatMap(g => g.expenses)
    : expenses;


  return (
    <div className="flex bg-base-200 flex-col p-2">

      <ExpensesOverview />   
           
      <div className="flex flex-col lg:flex-row">
        <SectionShell title={t('expenses.add')} icon={AppIcons.add} minimizable>
          <AddExpenseForm onAdd={handleAddExpense} onRecurringChange={() => refreshRecurring()} />
        </SectionShell>

        <SectionShell title="Upcoming Expenses" icon={AppIcons.recurring} refreshable>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* LEFT: Recurring list */}
            <div className="w-full lg:w-1/2">
              <UpcomingRecurringList
                recurringExpenses={recurringExpenses}
                loading={loadingRecurring}
                onSelect={setSelectedRecurringItem}
              />
            </div>
            {/* RIGHT: Edit or Summary */}
            <div className="w-full lg:w-1/2">
              {selectedRecurringItem ? (
                <EditRecurringItemForm
                  item={selectedRecurringItem}
                  onSave={handleRecurringSave}
                  onCancel={() => setSelectedRecurringItem(null)}
                />
              ) : (                
                <RecurringSummary
                  recurringExpenses={recurringExpenses}
                  monthlyTotal={monthlyRecurringTotal}
                  lastTriggered={lastTriggeredRecurring ?? undefined}
                  lastSkipped={lastSkippedRecurring ?? undefined}
                />
              )}
            </div>
          </div>
        </SectionShell>
      </div>

      <div className="flex flex-col lg:flex-row">
        <SectionShell
          title={t('expenses.allExpenses')}
          icon={AppIcons.list}
          extraHeaderContent={
            <div className="flex gap-4 text-sm font-medium text-base-content">
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
        <SectionShell title="Spending by Category" icon={AppIcons.pieChart}>
        <BreakdownPieChart
          data={chartData}
          groupBy={(e) => e.categoryName || 'Uncategorized'}
          getValue={(e) => e.amount}
          height={600}
          width={700}
        />
        </SectionShell>
      </div>
    </div>
  );
}
