import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from 'react';

import { useIncomeOverview } from '@/features/Incomes/services/incomesService';
import { IncomeOverviewDto } from '@/types/finance/income';

export type GroupByValue = 'month' | 'year' | 'category' | '';

type IncomeContextType = {
  overview: IncomeOverviewDto | undefined;
  overviewLoading: boolean;
  groupBy: GroupByValue;
  selectedCategories: string[];
  setGroupBy: (value: GroupByValue) => void;
  setSelectedCategories: (ids: string[]) => void;
  refreshOverview: () => Promise<void>;
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
    data: overview,
    isLoading: overviewLoading,
    refetch: refetchOverview,
  } = useIncomeOverview();

  const refreshOverview = useCallback(async () => {
    if (month && year) {
      await refetchOverview();
    }
  }, [refetchOverview, month, year]);

  const value = useMemo(
    () => ({
      overview,
      overviewLoading,
      groupBy,
      selectedCategories,
      setGroupBy,
      setSelectedCategories,
      refreshOverview,
    }),
    [
      overview,
      overviewLoading,
      groupBy,
      selectedCategories,
      refreshOverview,
    ]
  );

  return (
    <IncomeContext.Provider value={value}>
      {children}
    </IncomeContext.Provider>
  );
}

export function useIncomesContext() {
  const context = useContext(IncomeContext);
  if (!context) {
    throw new Error('useIncomesContext must be used within IncomeProvider');
  }
  return context;
}
