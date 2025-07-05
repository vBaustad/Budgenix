// hooks/useCashflowQuery.ts

import { useQuery } from '@tanstack/react-query';
import { fetchCashflowItems } from '../services/cashflowService';
import { CashflowItem } from '@/types/finance/cashflow';
import { useAuth } from '@/context/AuthContext';

export function useCashflowQuery() {
  const { isLoggedIn } = useAuth();

  return useQuery<CashflowItem[]>({
    queryKey: ['cashflow'],
    queryFn: fetchCashflowItems,
    enabled: isLoggedIn,
    staleTime: 1000 * 60 * 5,
  });
}
