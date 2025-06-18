import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';

import { Expense, GroupedExpenses } from '@/types/finance/expense';
import { useExpenses, useExpensesOverview } from '@/features/expenses/services/expensesService';

export type GroupByValue = 'month' | 'year' | 'category' | '';

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
  overview: ReturnType<typeof useExpensesOverview>['data'];
  overviewLoading: boolean;
  refreshOverview: () => Promise<void>;
};

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

export function ExpensesProvider({
  children,
  month,
  year,
}: {
  children: ReactNode;
  month: number;
  year: number;
}) {
  const [groupBy, setGroupBy] = useState<GroupByValue>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const {
    data: expensesData,
    isLoading: isExpensesLoading,
    refetch: refetchExpenses,
  } = useExpenses({
    categories: selectedCategories,
  });


  const {
    data: overview,
    isLoading: overviewLoading,
    refetch: refetchOverview,
  } = useExpensesOverview(month, year);

  const expenses = useMemo<Expense[]>(
    () => (Array.isArray(expensesData) ? (expensesData as Expense[]) : []),
    [expensesData]
  );

  const groupedExpenses = useMemo<GroupedExpenses>(
    () => (Array.isArray(expensesData) ? [] : expensesData ?? []),
    [expensesData]
  );

  const handleAddExpense = useCallback(
    (newExpense: Expense) => {
      if (!expensesData || !Array.isArray(expensesData)) return;
      (expensesData as Expense[]).unshift(newExpense);
    },
    [expensesData]
  );

  const refreshExpenses = useCallback(async () => {
    await refetchExpenses();
  }, [refetchExpenses]);

const refreshOverview = useCallback(async () => {
  if (month && year) {
    await refetchOverview(); 
  }
}, [refetchOverview, month, year]);



  const value = useMemo<ExpensesContextType>(
    () => ({
      expenses,
      groupedExpenses,
      loading: isExpensesLoading,
      groupBy,
      selectedCategories,
      setGroupBy,
      setSelectedCategories,
      refreshExpenses,
      handleAddExpense,
      overview,
      overviewLoading,
      refreshOverview,
    }),
    [
      expenses,
      groupedExpenses,
      isExpensesLoading,
      groupBy,
      selectedCategories,
      overview,
      overviewLoading,
      refreshExpenses,
      handleAddExpense,
      refreshOverview,
    ]
  );

  return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>;
}

export function useExpensesContext() {
  const context = useContext(ExpensesContext);
  if (!context) throw new Error('useExpensesContext must be used within ExpensesProvider');
  return context;
}
