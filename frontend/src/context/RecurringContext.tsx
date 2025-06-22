import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';
import { useRecurringOverview } from '@/features/recurring/services/recurringService';
import { RecurringItemDto, RecurringOverviewDto } from '@/types/finance/recurring';

type RecurringContextType = (Partial<RecurringOverviewDto> & {
  loadingRecurring: boolean;
  refreshRecurring: () => Promise<void>;
  selectedRecurringItem: RecurringItemDto | null;
  setSelectedRecurringItem: (item: RecurringItemDto | null) => void;
}) | null;

const RecurringContext = createContext<RecurringContextType>(null);

export function RecurringProvider({ children }: { children: ReactNode }) {
  const [selectedRecurringItem, setSelectedRecurringItem] = useState<RecurringItemDto | null>(null);

  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const {
    data: overview,
    isPending: loadingRecurring,
    refetch,
  } = useRecurringOverview(month, year);

  const refreshRecurring = async () => {
    await refetch();
  };

  return (
    <RecurringContext.Provider
      value={{
        ...(overview ?? {}),
        loadingRecurring,
        refreshRecurring,
        selectedRecurringItem,
        setSelectedRecurringItem,
      }}
    >
      {children}
    </RecurringContext.Provider>
  );
}

export function useRecurring() {
  const context = useContext(RecurringContext);
  if (!context) {
    throw new Error('useRecurring must be used within a RecurringProvider');
  }
  return context;
}
