import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchExpenses, isGroupedExpenses } from '../../services/app/expensesService';
import { fetchRecurringExpenses } from '../../services/app/recurringService';
import { fetchUsedCategories } from '../../services/app/categoriesService';
import { Expense, GroupedExpenses } from '../../types/finance/expense';
import { RecurringExpenseDto } from '../../types/finance/recurring';
import ExpensesOverview from '../../components/app/expenses/ExpensesOverview';
import AddExpenseForm from '../../components/app/expenses/AddExpenseForm';
import ExpensesList from '../../components/app/expenses/ExpensesList';
import GroupedExpensesList from '../../components/app/expenses/GroupedExpensesList';
import UpcomingRecurringList from '../../components/app/recurring/UpcomingRecurringList';
import EditRecurringItemForm from '../../components/app/recurring/EditRecurringItemForm';
import BreakdownPieChart from '../../components/common/charts/BreakdownPieChart';
import CategoryFilter from '../../components/common/filters/CategoryFilter';
import GroupByDropdown from '../../components/common/filters/GroupByDropdown';

export const GROUP_OPTIONS: { value: GroupByValue; label: string }[] = [
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
  { value: 'category', label: 'Category' },
];


export type GroupByOption = typeof GROUP_OPTIONS[number]['value'];
export type GroupByValue = 'month' | 'year' | 'category';


export default function ExpensesPage() {
  const { t } = useTranslation();

  const [groupBy, setGroupBy] = useState<'month' | 'category' | 'year' | ''>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [groupedExpenses, setGroupedExpenses] = useState<GroupedExpenses>([]);
  const [loading, setLoading] = useState(true);

  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpenseDto[]>([]);
  const [loadingRecurring, setLoadingRecurring] = useState(true);
  const [selectedRecurringItem, setSelectedRecurringItem] = useState<RecurringExpenseDto | null>(null);

  const handleAddExpense = (newExpense: Expense) => {
    setExpenses(prev => [newExpense, ...prev]);
  };

  useEffect(() => {
    fetchUsedCategories()
      .then((categories) => {
        setCategoryOptions(categories.map(c => ({ value: c.id, label: c.name })));
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchExpenses({
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      groupBy: groupBy || undefined,
    })
      .then((data) => {
        if (isGroupedExpenses(data)) {
          setGroupedExpenses(data);
          setExpenses([]);
        } else {
          setExpenses(data);
          setGroupedExpenses([]);
        }
      })
      .catch(() => {
        setExpenses([]);
        setGroupedExpenses([]);
      })
      .finally(() => setLoading(false));
  }, [selectedCategories, groupBy]);

  useEffect(() => {
    setLoadingRecurring(true);
    fetchRecurringExpenses()
      .then(setRecurringExpenses)
      .catch(console.error)
      .finally(() => setLoadingRecurring(false));
  }, []);

  return (
    <div className="flex flex-col">
      <ExpensesOverview />

      <div className="flex flex-col lg:flex-row m-4 gap-4">
        <section className="w-full bg-base-100 p-4 rounded-xl shadow-md">
          <h2 className="text-xl text-primary font-semibold mb-4">
            {t('expenses.addNew')}
          </h2>
          <div className="gap-4 mb-6 bg-base-200 rounded-xl shadow-md">
            <AddExpenseForm onAdd={handleAddExpense} onRecurringChange={() => fetchRecurringExpenses().then(setRecurringExpenses)} />
          </div>
        </section>

        <section className="w-full flex flex-col gap-4 lg:flex-row bg-base-100 p-4 rounded-xl shadow-md">
          <div className="w-full lg:w-2/3">
            <h3 className="text-xl text-primary font-semibold">Upcoming Expenses</h3>
            <UpcomingRecurringList
              recurringExpenses={recurringExpenses}
              loading={loadingRecurring}
              onSelect={setSelectedRecurringItem}
              setRecurringExpenses={setRecurringExpenses}
            />
          </div>

          <div className="w-full">
            {selectedRecurringItem && (
              <EditRecurringItemForm
                item={selectedRecurringItem}
                onSave={async () => {
                  setSelectedRecurringItem(null);
                  const data = await fetchRecurringExpenses();
                  setRecurringExpenses(data);
                }}
                onCancel={() => setSelectedRecurringItem(null)}
              />
            )}
          
          {/* RIGHT: Summary Info*/}
          {!selectedRecurringItem && (
            <div className="w-full">
              <h3 className="text-xl text-primary font-semibold mb-2">Recurring Summary</h3>

              <div className="space-y-2 text-base-content/80">
                <div>
                  <span className="font-semibold">Total active recurring:</span>{' '}
                  {recurringExpenses.filter(e => e.isActive).length}
                </div>
                  <div>
                  <span className="font-semibold">Total active recurring:</span>{' '}
                  {recurringExpenses.filter(e => e.isActive).length}
                </div>
                  <div>
                  <span className="font-semibold">Total active recurring:</span>{' '}
                  {recurringExpenses.filter(e => e.isActive).length}
                </div>
                  <div>
                  <span className="font-semibold">Total active recurring:</span>{' '}
                  {recurringExpenses.filter(e => e.isActive).length}
                </div>
                  <div>
                  <span className="font-semibold">Total active recurring:</span>{' '}
                  {recurringExpenses.filter(e => e.isActive).length}
                </div>
                <div>
                  <span className="font-semibold">Monthly total:</span>{' '}
                  {/* {formatCurrency(
                    recurringExpenses
                      .filter(e => e.isActive && e.recurrenceFrequency === 'monthly')
                      .reduce((sum, e) => sum + e.amount, 0),
                    currency
                  )} */}
                </div>
                <div>
                  <span className="font-semibold">Last triggered:</span>{' '}
                  {/* {recurringExpenses
                    .filter(e => e.lastTriggered)
                    .sort((a, b) =>
                      new Date(b.lastTriggered!).getTime() - new Date(a.lastTriggered!).getTime()
                    )[0]?.lastTriggered || '–'} */}
                </div>
                {/* Add more stats here later */}
              </div>
            </div>
          )}
        </div>
        </section>
      </div>

      <div className="flex flex-col lg:flex-row m-4 gap-4">
        <section className="w-full bg-base-100 p-4 rounded-xl shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
            <h2 className="text-xl text-primary font-semibold mb-2 sm:mb-0">
              {t('expenses.allExpenses')}
            </h2>

            <div className="flex gap-4 text-sm font-medium text-based-content relative">
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
            </div>

          <div className="max-h-[600px] overflow-x-auto shadow-md">
            {loading ? (
              <p className="text-base-content/60">{t('shared.loading')}</p>
            ) : groupBy ? (
              <GroupedExpensesList data={groupedExpenses} groupBy={groupBy} />
            ) : (
              <ExpensesList expenses={expenses} />
            )}
          </div>
        </section>

        <section className="w-full bg-base-100 p-4 rounded-xl shadow-md">
          <h3 className="text-xl text-primary font-semibold">Spending by Category</h3>
          <BreakdownPieChart
            data={expenses}
            groupBy={(e) => e.categoryName || 'Uncategorized'}
            getValue={(e) => e.amount}
            height={600}
            width={700}
          />
        </section>
      </div>
    </div>
  );
}
