import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchExpenses, isGroupedExpenses } from '../services/expensesService';
import { fetchRecurringExpenses } from '@/features/recurring/services/recurringService';
import { Expense, GroupedExpenses } from '@/types/finance/expense';
import { RecurringExpenseDto } from '@/types/finance/recurring';
import { useCategories } from '@/context/CategoryContext';

export type GroupByValue = 'month' | 'year' | 'category';

export function useExpensesPageState() {
  const { t } = useTranslation();
  const { categories, loading: loadingCategories } = useCategories();

  const [groupBy, setGroupBy] = useState<GroupByValue | ''>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [groupedExpenses, setGroupedExpenses] = useState<GroupedExpenses>([]);
  const [loading, setLoading] = useState(true);

  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpenseDto[]>([]);
  const [loadingRecurring, setLoadingRecurring] = useState(true);
  const [selectedRecurringItem, setSelectedRecurringItem] = useState<RecurringExpenseDto | null>(null);

  const monthlyRecurringTotal = recurringExpenses
    .filter(e => e.isActive)
    .reduce((sum, e) => sum + e.amount, 0);

  const lastTriggeredRecurring = [...recurringExpenses]
    .filter(e => e.lastTriggeredDate)
    .sort((a, b) => new Date(b.lastTriggeredDate!).getTime() - new Date(a.lastTriggeredDate!).getTime())[0];

  const lastSkippedRecurring = [...recurringExpenses]
    .filter(e => e.lastSkippedDate)
    .sort((a, b) => new Date(b.lastSkippedDate!).getTime() - new Date(a.lastSkippedDate!).getTime())[0];

  const handleAddExpense = (newExpense: Expense) => {
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const refreshRecurring = async () => {
    const data = await fetchRecurringExpenses();
    setRecurringExpenses(data);
  };

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
    refreshRecurring()
      .catch(console.error)
      .finally(() => setLoadingRecurring(false));
  }, []);

  return {
    t,
    groupBy,
    setGroupBy,
    selectedCategories,
    setSelectedCategories,
    categoryOptions,
    loadingCategories,
    expenses,
    groupedExpenses,
    loading,
    recurringExpenses,
    setRecurringExpenses,
    loadingRecurring,
    selectedRecurringItem,
    setSelectedRecurringItem,
    handleAddExpense,
    refreshRecurring,
    monthlyRecurringTotal,
    lastTriggeredRecurring,
    lastSkippedRecurring,
  };
}
