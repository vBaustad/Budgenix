import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';

import { Expense, GroupedExpenses } from '@/types/finance/expense';
import { useExpensesQuery } from '@/features/expenses/hooks/useExpenseQuery';
import { fetchExpensesOverview } from '@/features/expenses/services/expensesService';

export type GroupByValue = 'month' | 'year' | 'category' | '';

type ExpensesOverviewResponse = {
  totalSpent: number;
  lastMonthSpent: number;
  incomeReceived: number;
  upcomingRecurring: number;
  dailyTotals: number[];
};

type ExpensesContextType = {
  expenses: Expense[];
  groupedExpenses: GroupedExpenses;
  loading: boolean;
  groupBy: GroupByValue;
  selectedCategories: string[];
  setGroupBy: (value: GroupByValue) => void;
  setSelectedCategories: (ids: string[]) => void;
  refreshExpenses: () => Promise<void>;
  handleAddExpense: (expense: Expense) => void;
  overview: ExpensesOverviewResponse | null;
  overviewLoading: boolean;
  refreshOverview: (month: number, year: number) => Promise<void>;
};

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [groupBy, setGroupBy] = useState<GroupByValue>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [overview, setOverview] = useState<ExpensesOverviewResponse | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(false);

  const { data, isLoading, refetch } = useExpensesQuery({ groupBy, selectedCategories });

  const expenses = useMemo<Expense[]>(() => Array.isArray(data) ? data as Expense[] : [], [data]);
  const groupedExpenses = useMemo<GroupedExpenses>(() => {
  return Array.isArray(data) ? [] : data ?? [];
}, [data]);



  const refreshOverview = useCallback(async (month: number, year: number) => {
    setOverviewLoading(true);
    try {
      const result = await fetchExpensesOverview(month, year);
      setOverview(result);
    } catch (err) {
      console.error('[ExpensesContext] Failed to fetch overview:', err);
      setOverview(null);
    } finally {
      setOverviewLoading(false);
    }
  }, []);

  const handleAddExpense = useCallback((newExpense: Expense) => {
    if (!data || !Array.isArray(data)) return;
    (data as Expense[]).unshift(newExpense); // Cast to Expense[]
  }, [data]);




  const refreshExpenses = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const value = useMemo<ExpensesContextType>(() => ({
  expenses,
  groupedExpenses,
  loading: isLoading,
  groupBy,
  selectedCategories,
  setGroupBy,
  setSelectedCategories,
  refreshExpenses,
  handleAddExpense,
  overview,
  overviewLoading,
  refreshOverview,
}), [
  expenses,
  groupedExpenses,
  isLoading,
  groupBy,
  selectedCategories,
  overview,
  overviewLoading,
  refreshExpenses,
  handleAddExpense,
  refreshOverview,
]);


  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpensesContext);
  if (!context) throw new Error('useExpenses must be used within ExpensesProvider');
  return context;
}
