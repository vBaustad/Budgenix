// services/cashflowService.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/utils/api';
import { CashflowItem, CashflowSummaryDto, CreateCashflowItemDto, UpdateCashflowItemDto } from '@/types/finance/cashflow';
import { InsightDto } from '@/types/insights/insight';
import { useAuth } from '@/context/AuthContext';

// === API Base URL ===
const API_URL = '/api/cashflow';

// === Query Keys ===
export const CashflowQueryKeys = {
  all: ['cashflow'] as const,
  summary: ['cashflow', 'summary'] as const,
  insights: ['cashflow', 'insights'] as const,
};

// === API Calls ===

export async function fetchCashflowItems(): Promise<CashflowItem[]> {
  const result = await apiFetch<CashflowItem[]>(API_URL);
  if (!result) throw new Error('Failed to fetch cashflow items');
  return result;
}

export async function fetchCashflowSummary(): Promise<CashflowSummaryDto> {
  const result = await apiFetch<CashflowSummaryDto>(`${API_URL}/summary`);
  if (!result) throw new Error('Failed to fetch cashflow summary');
  return result;
}

export async function fetchCashflowInsights(): Promise<InsightDto[]> {
  const result = await apiFetch<InsightDto[]>(`${API_URL}/insights`);
  if (!result) throw new Error('Failed to fetch cashflow insights');
  return result;
}

export async function createCashflowItemApi(item: CreateCashflowItemDto): Promise<CashflowItem> {
  const result = await apiFetch<CashflowItem | null>(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });

  if (!result) throw new Error('Failed to create cashflow item');
  return result;
}

export async function updateCashflowItemApi({ id, data }: { id: string; data: UpdateCashflowItemDto }): Promise<void> {
  await apiFetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteCashflowItemApi(id: string): Promise<void> {
  await apiFetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
}

// === React Query Hooks ===

export function useCashflow() {
  const { isLoggedIn } = useAuth();

  return useQuery({
    queryKey: CashflowQueryKeys.all,
    queryFn: fetchCashflowItems,
    enabled: isLoggedIn,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCashflowSummary() {
  const { isLoggedIn } = useAuth();

  return useQuery({
    queryKey: CashflowQueryKeys.summary,
    queryFn: fetchCashflowSummary,
    enabled: isLoggedIn,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCashflowInsights() {
  const { isLoggedIn } = useAuth();

  return useQuery({
    queryKey: CashflowQueryKeys.insights,
    queryFn: fetchCashflowInsights,
    enabled: isLoggedIn,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCashflowItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCashflowItemApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CashflowQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: CashflowQueryKeys.summary });
      queryClient.invalidateQueries({ queryKey: CashflowQueryKeys.insights });
    },
  });
}

export function useUpdateCashflowItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCashflowItemApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CashflowQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: CashflowQueryKeys.summary });
      queryClient.invalidateQueries({ queryKey: CashflowQueryKeys.insights });
    },
  });
}

export function useDeleteCashflowItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCashflowItemApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CashflowQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: CashflowQueryKeys.summary });
      queryClient.invalidateQueries({ queryKey: CashflowQueryKeys.insights });
    },
  });
}

