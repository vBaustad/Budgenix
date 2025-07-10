'use client';

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from 'react';

import { Income } from '@/types/finance/income';
import {
  useIncomes,
  useIncomeOverview,
} from '@/features/Incomes/services/incomesService';
import { useIncomeMonthlySummary } from '../hooks/useIncomeMonthlySummary';

export type GroupByValue = 'month' | 'year' | 'category' | '';

type IncomeContextType = {
  incomes: Income[];
  loading: boolean;
  groupBy: GroupByValue;
  selectedCategories: string[];
  setGroupBy: (value: GroupByValue) => void;
  setSelectedCategories: (ids: string[]) => void;
  refreshIncomes: () => Promise<void>;
  handleAddIncome: (income: Income) => void;
  overview: ReturnType<typeof useIncomeOverview>['data'];
  overviewLoading: boolean;
  refreshOverview: () => Promise<void>;
  refreshMonthlySummary: () => Promise<void>;
};

const IncomeContext = createContext<IncomeContextType | undefined>(undefined);

export function IncomeProvider({
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
    data: incomeData,
    isLoading: isLoadingIncomes,
    refetch: refetchIncomes,
  } = useIncomes({
    categories: selectedCategories,
  });

  const {
    data: overview,
    isLoading: overviewLoading,
    refetch: refetchOverview,
  } = useIncomeOverview();

  const {
    refetch: refetchMonthlySummary,
  } = useIncomeMonthlySummary(12); // or however many months you're showing

  const incomes = useMemo<Income[]>(
    () => (Array.isArray(incomeData) ? (incomeData as Income[]) : []),
    [incomeData]
  );

  const handleAddIncome = useCallback(
    (newIncome: Income) => {
      if (!incomeData || !Array.isArray(incomeData)) return;
      (incomeData as Income[]).unshift(newIncome);
    },
    [incomeData]
  );

  const refreshIncomes = useCallback(async () => {
    await refetchIncomes();
  }, [refetchIncomes]);

  const refreshOverview = useCallback(async () => {
    if (month && year) {
      await refetchOverview();
    }
  }, [refetchOverview, month, year]);

  const refreshMonthlySummary = useCallback(async () => {
    await refetchMonthlySummary();
  }, [refetchMonthlySummary]);

  const value = useMemo<IncomeContextType>(
    () => ({
      incomes,
      loading: isLoadingIncomes,
      groupBy,
      selectedCategories,
      setGroupBy,
      setSelectedCategories,
      refreshIncomes,
      handleAddIncome,
      overview,
      overviewLoading,
      refreshOverview,
      refreshMonthlySummary,
    }),
    [
      incomes,
      isLoadingIncomes,
      groupBy,
      selectedCategories,
      overview,
      overviewLoading,
      refreshIncomes,
      handleAddIncome,
      refreshOverview,
      refreshMonthlySummary,
    ]
  );

  return <IncomeContext.Provider value={value}>{children}</IncomeContext.Provider>;
}

export function useIncomesContext() {
  const context = useContext(IncomeContext);
  if (!context) throw new Error('useIncomesContext must be used within IncomeProvider');
  return context;
}
