import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { useRecurringItemsQuery } from '@/features/recurring/hooks/useRecurringItemsQuery';
import { RecurringExpenseDto } from '@/types/finance/recurring';

type RecurringContextType = {
  recurringExpenses: RecurringExpenseDto[];
  loadingRecurring: boolean;
  refreshRecurring: () => Promise<void>;
  selectedRecurringItem: RecurringExpenseDto | null;
  setSelectedRecurringItem: (item: RecurringExpenseDto | null) => void;
  monthlyRecurringTotal: number;
  lastTriggeredRecurring: RecurringExpenseDto | null;
  lastSkippedRecurring: RecurringExpenseDto | null;
};

const RecurringContext = createContext<RecurringContextType | undefined>(undefined);

export function RecurringProvider({ children }: { children: ReactNode }) {
  const [selectedRecurringItem, setSelectedRecurringItem] = useState<RecurringExpenseDto | null>(null);

  const {
    data: recurringExpenses = [],
    isLoading: loadingRecurring,
    refetch,
  } = useRecurringItemsQuery();

  const refreshRecurring = async () => {
    await refetch();
  };

  const monthlyRecurringTotal = useMemo(
    () =>
      recurringExpenses
        .filter(e => e.isActive)
        .reduce((sum, e) => sum + e.amount, 0),
    [recurringExpenses]
  );

  const lastTriggeredRecurring = useMemo(
    () =>
      [...recurringExpenses]
        .filter(e => e.lastTriggeredDate)
        .sort(
          (a, b) =>
            new Date(b.lastTriggeredDate!).getTime() -
            new Date(a.lastTriggeredDate!).getTime()
        )[0] ?? null,
    [recurringExpenses]
  );

  const lastSkippedRecurring = useMemo(
    () =>
      [...recurringExpenses]
        .filter(e => e.lastSkippedDate)
        .sort(
          (a, b) =>
            new Date(b.lastSkippedDate!).getTime() -
            new Date(a.lastSkippedDate!).getTime()
        )[0] ?? null,
    [recurringExpenses]
  );

  return (
    <RecurringContext.Provider
      value={{
        recurringExpenses,
        loadingRecurring,
        refreshRecurring,
        selectedRecurringItem,
        setSelectedRecurringItem,
        monthlyRecurringTotal,
        lastTriggeredRecurring,
        lastSkippedRecurring,
      }}
    >
      {children}
    </RecurringContext.Provider>
  );
}

export function useRecurring() {
  const context = useContext(RecurringContext);
  if (!context)
    throw new Error('useRecurring must be used within RecurringProvider');
  return context;
}
