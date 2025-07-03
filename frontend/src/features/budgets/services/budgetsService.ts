import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/utils/api';
import {
  BudgetDto,
  BudgetProgressDto,
  CreateBudgetDto,
  UpdateBudgetDto
} from '@/types/finance/budget';
import { useAuth } from '@/context/AuthContext';

// === RAW FETCHERS ===

async function fetchBudgets(): Promise<BudgetDto[]> {
  const result = await apiFetch<BudgetDto[] | null>('/api/budget');
  if (!result) throw new Error('Failed to fetch budgets');
  return result;
}

async function fetchBudgetById(id: string): Promise<BudgetDto> {
  const result = await apiFetch<BudgetDto | null>(`/api/budget/${id}`);
  if (!result) throw new Error('Budget not found');
  return result;
}

async function fetchBudgetProgress(
  id: string,
  periodStart: string,
  periodEnd: string
): Promise<BudgetProgressDto> {
  const params = new URLSearchParams({ periodStart, periodEnd });
  const result = await apiFetch<BudgetProgressDto | null>(`/api/budget/${id}/progress?${params}`);
  if (!result) throw new Error('Failed to fetch budget progress');
  return result;
}

async function createBudget(data: CreateBudgetDto): Promise<BudgetDto> {
  const result = await apiFetch<BudgetDto | null>('/api/budget', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!result) throw new Error('Failed to create budget');
  return result;
}

async function updateBudget(data: UpdateBudgetDto): Promise<BudgetDto> {
  const result = await apiFetch<BudgetDto | null>(`/api/budget/${data.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!result) throw new Error('Failed to update budget');
  return result;
}

async function deleteBudget(id: string): Promise<void> {
  await apiFetch(`/api/budget/${id}`, { method: 'DELETE' });
}

// === HOOKS ===

export function useBudgets() {
  const { isLoggedIn } = useAuth();
  return useQuery<BudgetDto[]>({
    queryKey: ['budgets'],
    queryFn: fetchBudgets,
    enabled: isLoggedIn,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useBudgetById(id: string, options?: { enabled?: boolean }) {
  const { isLoggedIn } = useAuth();
  return useQuery<BudgetDto>({
    queryKey: ['budget', id],
    queryFn: () => fetchBudgetById(id),
    enabled: isLoggedIn && (options?.enabled ?? !!id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useBudgetProgress(id: string, periodStart: string, periodEnd: string) {
  const { isLoggedIn } = useAuth();
  return useQuery<BudgetProgressDto>({
    queryKey: ['budgetProgress', id, periodStart, periodEnd],
    queryFn: () => fetchBudgetProgress(id, periodStart, periodEnd),
    enabled: isLoggedIn && !!id && !!periodStart && !!periodEnd,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
}
