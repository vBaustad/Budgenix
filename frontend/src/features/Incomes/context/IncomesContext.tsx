import { createContext, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDateFilter } from '@/context/DateFilterContext';
import { IncomeOverviewDto, IncomeItem } from '@/types/finance/income';

type IncomeContextType = {
  incomes: IncomeItem[];
  overview: IncomeOverviewDto | undefined;
  loading: boolean;
  overviewLoading: boolean;
  refreshOverview: (month: number, year: number) => void;
};

const IncomeContext = createContext<IncomeContextType | undefined>(undefined);

export const IncomeProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const { selectedMonth, selectedYear } = useDateFilter();

    const {
    data: incomes = [],
    isLoading: loading,
    } = useQuery<IncomeItem[]>({
    queryKey: ['incomes', selectedYear, selectedMonth],
    queryFn: async () => {
      const from = new Date(selectedYear, selectedMonth - 1, 1).toISOString();
      const to = new Date(selectedYear, selectedMonth, 0).toISOString();
      const res = await fetch(`/api/incomes?from=${from}&to=${to}`);
      if (!res.ok) throw new Error('Failed to fetch incomes');
      const data = await res.json();
      return data;
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
    const data = await res.json();
    return data;
  },
  });


  const refreshOverview = (month: number, year: number) => {
    queryClient.invalidateQueries({ queryKey: ['incomeOverview', year, month] });
    queryClient.invalidateQueries({ queryKey: ['incomes', year, month] });
  };

  return (
    <IncomeContext.Provider
      value={{
        incomes,
        overview,
        loading,
        overviewLoading,
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
