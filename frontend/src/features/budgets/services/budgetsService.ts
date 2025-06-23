import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/utils/api';
import {
  BudgetDto,
  BudgetProgressDto,
  CreateBudgetDto,
  UpdateBudgetDto
} from '@/types/finance/budget';

// === RAW FETCHERS ===

async function fetchBudgets(): Promise<BudgetDto[]> {
  return await apiFetch('/api/budget');
}

async function fetchBudgetById(id: string): Promise<BudgetDto> {
  return await apiFetch(`/api/budget/${id}`);
}

async function fetchBudgetProgress(id: string, periodStart: string, periodEnd: string): Promise<BudgetProgressDto> {
  const params = new URLSearchParams({ periodStart, periodEnd });
  return await apiFetch(`/api/budget/${id}/progress?${params.toString()}`);
}

async function createBudget(data: CreateBudgetDto): Promise<BudgetDto> {
  return await apiFetch('/api/budget', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

async function updateBudget(data: UpdateBudgetDto): Promise<BudgetDto> {
  return await apiFetch(`/api/budget/${data.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

async function deleteBudget(id: string): Promise<void> {
  await apiFetch(`/api/budget/${id}`, { method: 'DELETE' });
}

// === HOOKS ===

export function useBudgets() {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: fetchBudgets,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useBudgetById(id: string, options?: { enabled?: boolean }) {
  return useQuery<BudgetDto>({
    queryKey: ['budget', id],
    queryFn: () => fetchBudgetById(id),
    enabled: options?.enabled ?? !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useBudgetProgress(id: string, periodStart: string, periodEnd: string) {
  return useQuery({
    queryKey: ['budgetProgress', id, periodStart, periodEnd],
    queryFn: () => fetchBudgetProgress(id, periodStart, periodEnd),
    enabled: !!id && !!periodStart && !!periodEnd,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBudget,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['budgets'] }),
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBudget,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['budgets'] }),
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBudget,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['budgets'] }),
  });
}
