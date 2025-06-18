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
import { useExpensesContext } from '@/features/expenses/context/ExpensesContext';
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
} = useExpensesContext();

const {
  recurringExpenses,
  loadingRecurring,
  refreshRecurring,
  selectedRecurringItem,
  setSelectedRecurringItem,
  monthlyRecurringExpenseTotal,
  lastTriggeredRecurringExpense,
  lastSkippedRecurringExpense,
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
    <div className="flex flex-col gap-4 p-4 w-full max-w-full overflow-hidden">

      <ExpensesOverview />   

      <div className="flex flex-col lg:flex-row w-full max-w-full gap-4">
        <SectionShell title={t('expenses.add')} icon={AppIcons.add} minimizable className="w-full">
          <AddExpenseForm onAdd={handleAddExpense} onRecurringChange={() => refreshRecurring()} />
        </SectionShell>

        <SectionShell title="Upcoming Expenses" icon={AppIcons.recurring} refreshable className="w-full">
          <div className="flex flex-col lg:flex-row gap-4 w-full">
            {/* LEFT: Recurring list */}
            <div className="w-full lg:w-1/2">
              <UpcomingRecurringList
                recurringItems={recurringExpenses}
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
                  recurringItems={recurringExpenses}
                  monthlyTotal={monthlyRecurringExpenseTotal}
                  lastTriggered={lastTriggeredRecurringExpense}
                  lastSkipped={lastSkippedRecurringExpense}
                />
              )}
            </div>
          </div>
        </SectionShell>
      </div>

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

        <SectionShell 
          title="Spending by Category" 
          icon={AppIcons.pieChart} 
          className="w-full hidden sm:block"
        >
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
    </div>
  );
}
