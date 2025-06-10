import { createContext, useContext } from 'react';
import { useBudgetsQuery } from '../hooks/useBudgetsQuery';
import { BudgetProgressItem } from '@/types/finance/budget';

interface BudgetsContextType {
  budgets: BudgetProgressItem[];
  isLoading: boolean;
  updateBudgetAmount: (id: string, amount: number) => Promise<void>;
}

const BudgetsContext = createContext<BudgetsContextType>({
  budgets: [],
  isLoading: false,
  updateBudgetAmount: async () => {},
});

export const BudgetsProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading, updateAmount } = useBudgetsQuery();

  return (
    <BudgetsContext.Provider
      value={{
        budgets: data ?? [],
        isLoading,
        updateBudgetAmount: updateAmount,
      }}
    >
      {children}
    </BudgetsContext.Provider>
  );
};

export const useBudgets = () => useContext(BudgetsContext);
