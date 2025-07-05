import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  ReactNode,
} from 'react';

import {
  useCashflow,
  useCashflowSummary,
  useCashflowInsights,
  useCreateCashflowItem,
  useDeleteCashflowItem,
  useUpdateCashflowItem,
} from '../services/cashflowService';

import {
  CashflowItem,
  CreateCashflowItemDto,
  UpdateCashflowItemDto,
  CashflowSummaryDto
} from '@/types/finance/cashflow';

import { InsightDto } from '@/types/insights/insight';

type DeleteOptions = {
  onSuccess?: () => void;
  onError?: () => void;
};

type CashflowContextType = {
  cashflowItems: CashflowItem[];
  cashflowSummary?: CashflowSummaryDto;
  cashflowInsights: InsightDto[];
  loading: boolean;
  refreshCashflow: () => Promise<void>;
  createItem: (dto: CreateCashflowItemDto) => Promise<void>;
  deleteItem: (id: string, options?: DeleteOptions) => Promise<void>;
  updateItem: (params: { id: string; data: UpdateCashflowItemDto }, options?: DeleteOptions) => Promise<void>;
};

const CashflowContext = createContext<CashflowContextType | undefined>(undefined);

export function CashflowProvider({ children }: { children: ReactNode }) {
  const {
    data: items = [],
    isLoading: isItemsLoading,
    refetch: refetchItems,
  } = useCashflow();

  const {
    data: summary,
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
  } = useCashflowSummary();

  const {
    data: insights = [],
    isLoading: isInsightsLoading,
    refetch: refetchInsights,
  } = useCashflowInsights();

  const createMutation = useCreateCashflowItem();
  const deleteMutation = useDeleteCashflowItem();
  const updateMutation = useUpdateCashflowItem();

  const refreshCashflow = useCallback(async () => {
    await Promise.all([
      refetchItems(),
      refetchSummary(),
      refetchInsights(),
    ]);
  }, [refetchItems, refetchSummary, refetchInsights]);

  const createItem = useCallback(
    async (dto: CreateCashflowItemDto) => {
      await createMutation.mutateAsync(dto);
    },
    [createMutation]
  );

  const updateItem = useCallback(
    async (
      params: { id: string; data: UpdateCashflowItemDto },
      options?: DeleteOptions
    ) => {
      try {
        await updateMutation.mutateAsync(params);
        options?.onSuccess?.();
      } catch (error) {
        console.error('Update failed:', error);
        options?.onError?.();
      }
    },
    [updateMutation]
  );

  const deleteItem = useCallback(
    async (id: string, options?: DeleteOptions) => {
      try {
        await deleteMutation.mutateAsync(id);
        options?.onSuccess?.();
      } catch (error) {
        console.error('Delete failed:', error);
        options?.onError?.();
      }
    },
    [deleteMutation]
  );

  const value = useMemo<CashflowContextType>(
    () => ({
      cashflowItems: items,
      cashflowSummary: summary,
      cashflowInsights: insights,
      loading: isItemsLoading || isSummaryLoading || isInsightsLoading,
      refreshCashflow,
      createItem,
      deleteItem,
      updateItem,
    }),
    [
      items,
      summary,
      insights,
      isItemsLoading,
      isSummaryLoading,
      isInsightsLoading,
      refreshCashflow,
      createItem,
      deleteItem,
      updateItem,
    ]
  );

  return (
    <CashflowContext.Provider value={value}>
      {children}
    </CashflowContext.Provider>
  );
}

export function useCashflowContext() {
  const context = useContext(CashflowContext);
  if (!context) {
    throw new Error('useCashflowContext must be used within a CashflowProvider');
  }
  return context;
}
