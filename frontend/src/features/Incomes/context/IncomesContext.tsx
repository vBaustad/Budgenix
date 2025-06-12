import {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDateFilter } from '@/context/DateFilterContext';
import { GroupedIncomes, Income, IncomeOverviewDto } from '@/types/finance/income';

type GroupByValue = 'month' | 'year' | 'category' | '';

type IncomeContextType = {
  incomes: Income[];
  groupedIncomes: GroupedIncomes;
  loading: boolean;
  overview: IncomeOverviewDto | undefined;
  overviewLoading: boolean;
  groupBy: GroupByValue;
  selectedCategories: string[];
  setGroupBy: (val: GroupByValue) => void;
  setSelectedCategories: (ids: string[]) => void;
  handleAddIncome: (income: Income) => void;
  refreshOverview: (month: number, year: number) => void;
};

const IncomeContext = createContext<IncomeContextType | undefined>(undefined);

export const IncomeProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const { selectedMonth, selectedYear } = useDateFilter();

  const [groupBy, setGroupBy] = useState<GroupByValue>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const {
    data: incomes = [],
    isLoading: loading,
  } = useQuery<Income[]>({
    queryKey: ['incomes', selectedYear, selectedMonth, groupBy, selectedCategories],
    queryFn: async () => {
      const from = new Date(selectedYear, selectedMonth - 1, 1).toISOString();
      const to = new Date(selectedYear, selectedMonth, 0).toISOString();
      const params = new URLSearchParams({ from, to });
      if (groupBy) params.append('groupBy', groupBy);
      if (selectedCategories.length > 0) {
        params.append('categories', selectedCategories.join(','));
      }

      const res = await fetch(`/api/incomes?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch incomes');
      return await res.json();
    },
  });

  const {
    data: overview,
    isLoading: overviewLoading,
  } = useQuery<IncomeOverviewDto>({
    queryKey: ['incomeOverview', selectedYear, selectedMonth],
    queryFn: async () => {
      const res = await fetch(`/api/incomes/overview?month=${selectedMonth}&year=${selectedYear}`);
      if (!res.ok) throw new Error('Failed to fetch income overview');
      return await res.json();
    },
  });

  const handleAddIncome = (income: Income) => {
    queryClient.setQueryData<Income[]>(
      ['incomes', selectedYear, selectedMonth, groupBy, selectedCategories],
      (old = []) => [income, ...old]
    );
  };

  const refreshOverview = (month: number, year: number) => {
    queryClient.invalidateQueries({ queryKey: ['incomeOverview', year, month] });
    queryClient.invalidateQueries({ queryKey: ['incomes', year, month] });
  };

  const groupedIncomes = useMemo(() => {
    if (!groupBy || !Array.isArray(incomes)) return [];

    const map = new Map<string, Income[]>();

    incomes.forEach((income) => {
      let key = '';
      switch (groupBy) {
        case 'month':
          key = new Date(income.date).toISOString().slice(0, 7); // yyyy-mm
          break;
        case 'year':
          key = new Date(income.date).getFullYear().toString();
          break;
        case 'category':
          key = income.categoryName ?? 'Uncategorized';
          break;
      }

      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(income);
    });

    return Array.from(map.entries()).map(([groupName, incomes]) => ({
      groupName,
      totalAmount: incomes.reduce((sum, i) => sum + i.amount, 0),
      incomes,
    }));
  }, [incomes, groupBy]);

  return (
    <IncomeContext.Provider
      value={{
        incomes,
        groupedIncomes,
        loading,
        overview,
        overviewLoading,
        groupBy,
        selectedCategories,
        setGroupBy,
        setSelectedCategories,
        handleAddIncome,
        refreshOverview,
      }}
    >
      {children}
    </IncomeContext.Provider>
  );
};

export function useIncomes() {
  const context = useContext(IncomeContext);
  if (!context) throw new Error('useIncomes must be used within IncomeProvider');
  return context;
}
