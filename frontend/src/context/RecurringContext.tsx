import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { useRecurringItemsQuery } from '@/features/recurring/hooks/useRecurringItemsQuery';
import { RecurringItemDto } from '@/types/finance/recurring';
import { useAuth } from '@/context/AuthContext';

type RecurringContextType = {
  recurringItems: RecurringItemDto[];
  recurringExpenses: RecurringItemDto[];
  recurringIncomes: RecurringItemDto[];
  loadingRecurring: boolean;
  refreshRecurring: () => Promise<void>;
  selectedRecurringItem: RecurringItemDto | null;
  setSelectedRecurringItem: (item: RecurringItemDto | null) => void;
  monthlyRecurringExpenseTotal: number;
  monthlyRecurringIncomeTotal: number;
  lastTriggeredRecurringExpense: RecurringItemDto | null;
  lastSkippedRecurringExpense: RecurringItemDto | null;
  lastTriggeredRecurringIncome: RecurringItemDto | null;
};

const RecurringContext = createContext<RecurringContextType | undefined>(undefined);

export function RecurringProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [selectedRecurringItem, setSelectedRecurringItem] = useState<RecurringItemDto | null>(null);

  const {
    data: recurringItems = [],
    isLoading: loadingRecurring,
    refetch,
  } = useRecurringItemsQuery(isLoggedIn);

  const refreshRecurring = async () => {
    await refetch();
  };

  const recurringExpenses = useMemo(
    () => recurringItems.filter(item => item.type === 'Expense'),
    [recurringItems]
  );

  const recurringIncomes = useMemo(
    () => recurringItems.filter(item => item.type === 'Income'),
    [recurringItems]
  );

  const monthlyRecurringExpenseTotal = useMemo(
    () =>
      recurringExpenses
        .filter(e => e.isActive)
        .reduce((sum, e) => sum + e.amount, 0),
    [recurringExpenses]
  );

  const lastTriggeredRecurringExpense = useMemo(
    () =>
      [...recurringExpenses]
        .filter(e => e.lastTriggeredDate)
        .sort((a, b) =>
          new Date(b.lastTriggeredDate!).getTime() - new Date(a.lastTriggeredDate!).getTime()
        )[0] ?? null,
    [recurringExpenses]
  );

  const lastSkippedRecurringExpense = useMemo(
    () =>
      [...recurringExpenses]
        .filter(e => e.lastSkippedDate)
        .sort((a, b) =>
          new Date(b.lastSkippedDate!).getTime() - new Date(a.lastSkippedDate!).getTime()
        )[0] ?? null,
    [recurringExpenses]
  );

  const lastTriggeredRecurringIncome = useMemo(
    () =>
      [...recurringIncomes]
        .filter(e => e.lastTriggeredDate)
        .sort((a, b) =>
          new Date(b.lastTriggeredDate!).getTime() - new Date(a.lastTriggeredDate!).getTime()
        )[0] ?? null,
    [recurringIncomes]
  );

  const monthlyRecurringIncomeTotal = useMemo(
    () =>
      recurringIncomes
        .filter(e => e.isActive)
        .reduce((sum, e) => sum + e.amount, 0),
    [recurringIncomes]
  );

  return (
    <RecurringContext.Provider
      value={{
        recurringItems,
        recurringExpenses,
        recurringIncomes,
        loadingRecurring,
        refreshRecurring,
        selectedRecurringItem,
        setSelectedRecurringItem,
        monthlyRecurringExpenseTotal,
        monthlyRecurringIncomeTotal,
        lastTriggeredRecurringExpense,
        lastSkippedRecurringExpense,
        lastTriggeredRecurringIncome,
      }}
    >
      {children}
    </RecurringContext.Provider>
  );
}

export function useRecurring() {
  const context = useContext(RecurringContext);
  if (!context) throw new Error('useRecurring must be used within RecurringProvider');
  return context;
}
