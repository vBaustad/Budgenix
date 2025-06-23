import { createContext, useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BudgetProgressDto } from '@/types/finance/budget';
import { apiFetch } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';

async function fetchBudgetProgress(): Promise<BudgetProgressDto[]> {
  return await apiFetch('/api/budget/progress');
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
  const { data, isLoading } = useQuery({
    queryKey: ['budgets', 'progress'],
    queryFn: fetchBudgetProgress,
    enabled: isLoggedIn,
  });

  const [editTargetId, setEditTargetId] = useState<string | null>(null);

  const openEditModal = (id: string) => setEditTargetId(id);
  const closeEditModal = () => setEditTargetId(null);

  return (
    <BudgetsContext.Provider
      value={{
        budgets: data ?? [],
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
