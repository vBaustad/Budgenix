import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';

import { GoalDto } from '@/types/finance/goal';
import { useGoals } from '../services/GoalsService';

type GoalsContextType = {
  goals: GoalDto[];
  loading: boolean;
  activeOnly: boolean;
  setActiveOnly: (value: boolean) => void;
  refreshGoals: () => Promise<void>;
  handleAddGoal: (goal: GoalDto) => void;
};

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export function GoalsProvider({ children }: { children: ReactNode }) {
  const [activeOnly, setActiveOnly] = useState<boolean>(false);

  const {
    data: goalsData,
    isLoading,
    refetch,
  } = useGoals(activeOnly);

  const goals = useMemo(() => goalsData ?? [], [goalsData]);

  const refreshGoals = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleAddGoal = useCallback(
    (newGoal: GoalDto) => {
      // Local addition (optional: for optimistic UI)
      console.log('Locally added goal:', newGoal);
    },
    []
  );

  const value = useMemo<GoalsContextType>(
    () => ({
      goals,
      loading: isLoading,
      activeOnly,
      setActiveOnly,
      refreshGoals,
      handleAddGoal,
    }),
    [goals, isLoading, activeOnly, refreshGoals, handleAddGoal]
  );

  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>;
}

export function useGoalsContext() {
  const context = useContext(GoalsContext);
  if (!context) throw new Error('useGoalsContext must be used within GoalsProvider');
  return context;
}
