import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchExpenses, isGroupedExpenses } from '../../services/app/expensesService';
import { fetchRecurringExpenses} from '../../services/app/recurringService';
import { fetchUsedCategories } from '../../services/app/categoriesService';
import { Expense, GroupedExpenses} from '../../types/finance/expense';
import { RecurringExpenseDto } from '../../types/finance/recurring';
import UpcomingRecurringList from '../../components/app/recurring/UpcomingRecurringList';
import EditRecurringItemForm from '../../components/app/recurring/EditRecurringItemForm';
import ExpensesList from '../../components/app/expenses/ExpensesList';
import GroupedExpensesList from '../../components/app/expenses/GroupedExpensesList';
import ExpensesOverview from '../../components/app/expenses/ExpensesOverview';
import AddExpenseForm from '../../components/app/expenses/AddExpenseForm';
import SelectField from '../../components/common/forms/SelectField';
import BreakdownPieChart from '../../components/common/charts/BreakdownPieChart';

type GroupByOption = 'month' | 'category' | 'year';

export default function ExpensesPage() {
  const { t } = useTranslation();
  const [filterCategory, setFilterCategory] = useState('');
  const [groupBy, setGroupBy] = useState<GroupByOption | undefined>(undefined);
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [groupedExpenses, setGroupedExpenses] = useState<GroupedExpenses>([]);
  const [loading, setLoading] = useState(true);
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpenseDto[]>([]);
  const [loadingRecurring, setLoadingRecurring] = useState(true);
  const [selectedRecurringItem, setSelectedRecurringItem] = useState<RecurringExpenseDto | null>(null);

  const handleAddExpense = (newExpense: Expense) => {
    setExpenses(prev => [newExpense, ...prev]); // or sort however you need
  };
  
  const fetchRecurring = async () => {
    setLoadingRecurring(true); 
    try {
      const data = await fetchRecurringExpenses();
      setRecurringExpenses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRecurring(false); 
    }
  };  
  
  useEffect(() => {
    fetchRecurring();
  }, []);

  useEffect(() => {
    setLoading(true);
  
    fetchExpenses({
      category: filterCategory || undefined,
      groupBy,
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
      .catch((err) => {
        console.error(err);
        setExpenses([]);
        setGroupedExpenses([]);
      })
      .finally(() => setLoading(false));
  }, [filterCategory, groupBy]);

  useEffect(() => {
    fetchUsedCategories()
      .then((categories) => {
        const options = [
          { value: '', label: '' }, // optional empty default
          ...categories.map(c => ({ value: c.id, label: c.name }))
        ];      
        setCategoryOptions(options);
      })
      .catch((err) => {
        console.error('Failed to load categories', err);
        setCategoryOptions([]);
      });
  }, []);

return (
  <div className="flex flex-col">
    <ExpensesOverview />


    {/* Add new expense */}
    <div className="flex flex-col lg:flex-row m-4 gap-4">
      <section className="w-full flex flex-col bg-base-100 p-4 rounded-xl shadow-md">        
          {/* Left side - Add expense */}
          <h2 className="text-xl text-primary font-semibold mb-4">
            {t('expenses.addNew')}
          </h2>
          <div className="gap-4 mb-6 bg-base-200 rounded-xl shadow-md">
            <AddExpenseForm onAdd={handleAddExpense} onRecurringChange={fetchRecurring} />
          </div>
      </section>
      {/* Right side - show recurring */}
      <section className="w-full flex flex-col lg:flex-row gap-4 bg-base-100 p-4 rounded-xl shadow-md">          
        {/* Left: Upcoming Recurring List */}
        <div className="w-full lg:w-1/3 flex flex-col rounded-2xl">
          <h3 className="text-xl text-primary font-semibold">
            Upcoming Expenses
          </h3>
            <UpcomingRecurringList
              recurringExpenses={recurringExpenses}
              loading={loadingRecurring}
              onSelect={setSelectedRecurringItem}
            />
        </div>
        {/* Right side - editor */}
        <div className="w-full lg:w-1/3 space-y-4 max-w-md">
          {selectedRecurringItem ? (
            <EditRecurringItemForm
              item={selectedRecurringItem}
              onSave={async () => {
                setSelectedRecurringItem(null);
                await fetchRecurring();
              }}
              onCancel={() => setSelectedRecurringItem(null)}
            />
          ) : (
            <>
              {/* <RecurringSummary />
              <RecentlyTriggered />
              <RecurringInsight /> */}
            </>
          )}
        </div>
      </section>
    </div>

    {/* All expenses list + Pie chart */}
    <div className="flex flex-col lg:flex-row m-4 gap-4">
      {/* LEFT side: title + filters + table */}
      <section className="w-full flex flex-col bg-base-100 p-4 rounded-xl shadow-md">
        <div className="flex flex-col">          
          <div className="flex-1 rounded-xl  min-w-0">
            <h2 className="text-xl text-primary font-semibold mb-4">
              {t('expenses.allExpenses')}
            </h2>
            <div className="flex gap-4 mb-6">
                <SelectField
                  name="categoryFilter"
                  label={t('shared.filterByCategory')}
                  placeholder={t('shared.noFilter')}
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  options={categoryOptions}
                />
                <SelectField
                  name="groupBy"
                  label={t('shared.groupBy')}
                  value={groupBy ?? ''}
                  onChange={(e) => setGroupBy(e.target.value as GroupByOption)}
                  placeholder={t('shared.noGrouping')}
                  options={[
                    { value: 'month', label: t('shared.groupingOptions.month') },
                    { value: 'year', label: t('shared.groupingOptions.year') },
                    { value: 'category', label: t('shared.groupingOptions.category') },
                  ]}
                />
              </div>
              <div className="max-h-[500px] overflow-x-auto shadow-md">
              {loading ? (
                <p className="text-base-content/60">{t('shared.loading')}</p>
              ) : groupBy ? (
                <GroupedExpensesList data={groupedExpenses} groupBy={groupBy} />
              ) : (
                <ExpensesList expenses={expenses} />
              )}
            </div>
          </div>
        </div>
      </section>
      {/* RIGHT side: chart */}
      <section className="w-full flex bg-base-100 p-4 rounded-xl shadow-md">          
          <div className=" flex-1 rounded-2xl">
            <h3 className="text-xl text-primary font-semibold">
              Spending by Category
            </h3>          
            <div>
              <BreakdownPieChart
                data={expenses}
                groupBy={(e) => e.categoryName || 'Uncategorized'}
                getValue={(e) => e.amount}
                height={600}
                width={700}
              />
            </div>
          </div>
      </section>
    </div>
  </div>  
  );
}
