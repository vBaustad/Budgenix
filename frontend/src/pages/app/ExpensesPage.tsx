import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchExpenses, fetchUsedCategories, isGroupedExpenses } from '../../services/app/expensesService';
import { Expense, GroupedExpenses } from '../../types/finance/expense';
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
          { value: '', label: t('shared.allCategories') },
          ...categories.map((cat) => ({ value: cat, label: cat }))
        ];        
        setCategoryOptions(options);
      })
      .catch((err) => {
        console.error('Failed to load categories', err);
        setCategoryOptions([]);
      });
  }, []);

return (
  <div className="flex flex-col gap-8">
    <ExpensesOverview />

    <section className="bg-base-100 p-4 rounded-xl shadow-md m-4">
      <h2 className="text-lg font-semibold text-base-content mb-2">
        {t('expenses.addNew')}
      </h2>
      <AddExpenseForm />
    </section>

    <section className="bg-base-100 p-4 rounded-xl shadow-md m-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT side: title + filters + table */}
        <div className="flex-1   rounded-xl border border-l-4 border-primary min-w-0 lg:min-w-[50%] p-4">
          <h2 className="text-xl text-primary font-semibold mb-4">
            {t('expenses.allExpenses')}
          </h2>

          <div className="flex flex-wrap gap-4 mb-6">
              <SelectField
                name="categoryFilter"
                label={t('shared.filterByCategory')}
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
            <div className="max-w-6xl max-h-[500px] w-full overflow-x-auto shadow-md">
            {loading ? (
              <p className="text-base-content/60">{t('shared.loading')}</p>
            ) : groupBy ? (
              <GroupedExpensesList data={groupedExpenses} groupBy={groupBy} />
            ) : (
              <ExpensesList expenses={expenses} />
            )}
          </div>
        </div>

        {/* RIGHT side: chart */}
        <div className="w-full lg:max-w-[45%] p-4 flex-shrink-0 max-h-[700px] border border-l-4 border-primary rounded-2xl shadow-md">
          <h3 className="text-xl text-primary font-semibold m-4">
            Spending by Category
          </h3>          
          <div className="w-full h-[600px] flex items-center justify-center">
            <BreakdownPieChart
              data={expenses}
              groupBy={(e) => e.categoryName || 'Uncategorized'}
              getValue={(e) => e.amount}
              height={500}
              width={600}
            />
          </div>
        </div>
      </div>
    </section>
  </div>
  );
}
