import { createContext, useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BudgetProgressDto } from '@/types/finance/budget';
import { apiFetch } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';

async function fetchBudgetProgress(): Promise<BudgetProgressDto[]> {
  const result = await apiFetch<BudgetProgressDto[] | null>('/api/budget/progress');
  if (!result) throw new Error('Failed to fetch budget progress');
  return result;
}

interface BudgetsContextType {
  budgets: BudgetProgressDto[];
  isLoading: boolean;
  editTargetId: string | null;
  openEditModal: (id: string) => void;
  closeEditModal: () => void;
}

const BudgetsContext = createContext<BudgetsContextType>({
  budgets: [],
  isLoading: false,
  editTargetId: null,
  openEditModal: () => {},
  closeEditModal: () => {},
});

export const BudgetsProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();
  const [editTargetId, setEditTargetId] = useState<string | null>(null);

  const {
    data: budgets = [],
    isLoading,
  } = useQuery<BudgetProgressDto[]>({
    queryKey: ['budgets', 'progress'],
    queryFn: fetchBudgetProgress,
    enabled: isLoggedIn,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const openEditModal = (id: string) => setEditTargetId(id);
  const closeEditModal = () => setEditTargetId(null);

  return (
    <BudgetsContext.Provider
      value={{
        budgets,
        isLoading,
        editTargetId,
        openEditModal,
        closeEditModal,
      }}
    >
      {children}
    </BudgetsContext.Provider>
  );
};

export const useBudgets = () => useContext(BudgetsContext);
