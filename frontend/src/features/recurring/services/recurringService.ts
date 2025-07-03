import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/utils/api';
import { toast } from 'react-hot-toast';
import { Expense } from '@/types/finance/expense';
import { ApiResponse } from '@/types/shared/ApiResponse';
import {
  CreateRecurringItemDto,
  UpdateRecurringItemDto,
  RecurringItemDto,
  RecurringOverviewDto
} from '@/types/finance/recurring';
import { useAuth } from '@/context/AuthContext';

const RECURRING_QUERY_KEY = ['recurring-items'];
const UPCOMING_QUERY_KEY = ['upcoming-recurring'];
const OVERVIEW_QUERY_KEY = (month: number, year: number) => ['recurring-overview', month, year];

// --- RAW FETCHERS ---
async function fetchApiResponse<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await apiFetch<ApiResponse<T> | null>(url, options);
  if (!res || !res.ok) throw new Error(res?.message || 'Unknown API error');
  return res.data!;
}


async function fetchRecurringItems(): Promise<RecurringItemDto[]> {
  return fetchApiResponse<RecurringItemDto[]>('/api/recurring');
}

async function fetchUpcomingRecurring(): Promise<RecurringItemDto[]> {
  return fetchApiResponse<RecurringItemDto[]>('/api/recurring/upcoming');
}

async function fetchRecurringOverview(month: number, year: number): Promise<RecurringOverviewDto> {
  return fetchApiResponse<RecurringOverviewDto>(`/api/recurring/overview?month=${month}&year=${year}`);
}

async function createRecurringItem(data: CreateRecurringItemDto): Promise<RecurringItemDto> {
  return fetchApiResponse<RecurringItemDto>('/api/recurring', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

async function updateRecurringItem(id: string, data: UpdateRecurringItemDto): Promise<RecurringItemDto> {
  return fetchApiResponse<RecurringItemDto>(`/api/recurring/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

async function deleteRecurringItem(id: string): Promise<void> {
  await fetchApiResponse<object>(`/api/recurring/${id}`, { method: 'DELETE' });
}

async function triggerRecurringItem(id: string): Promise<Expense> {
  return fetchApiResponse<Expense>(`/api/recurring/${id}/trigger`, { method: 'POST' });
}

async function skipRecurringItem(id: string, occurrenceDate?: string): Promise<void> {
  const url = occurrenceDate
    ? `/api/recurring/${id}/skip?occurrenceDate=${encodeURIComponent(occurrenceDate)}`
    : `/api/recurring/${id}/skip`;
  await fetchApiResponse<object>(url, { method: 'POST' });
}

// --- HOOKS ---
export function useRecurringItems() {
  const { isLoggedIn } = useAuth();
  return useQuery({
    queryKey: RECURRING_QUERY_KEY,
    queryFn: fetchRecurringItems,
    enabled: isLoggedIn,   // 🔑 Prevents firing when not logged in
    staleTime: 1000 * 60 * 5,
    gcTime: 10 * 60 * 1000,
  });
}

export function useUpcomingRecurring() {
  const { isLoggedIn } = useAuth();
  return useQuery({
    queryKey: UPCOMING_QUERY_KEY,
    queryFn: fetchUpcomingRecurring,
    enabled: isLoggedIn,
    staleTime: 1000 * 60 * 5,
  });
}

export function useRecurringOverview(month: number, year: number) {
  const { isLoggedIn } = useAuth();
  return useQuery({
    queryKey: OVERVIEW_QUERY_KEY(month, year),
    queryFn: () => fetchRecurringOverview(month, year),
    enabled: isLoggedIn && !!month && !!year,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateRecurringItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRecurringItem,
    onSuccess: () => {
      toast.success('Recurring item created');
      queryClient.invalidateQueries({ queryKey: RECURRING_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: UPCOMING_QUERY_KEY });
      queryClient.invalidateQueries({ predicate: query => query.queryKey[0] === 'recurring-overview' });
    },
    onError: (err: Error) => toast.error(`Failed to create: ${err.message}`),
  });
}

export function useUpdateRecurringItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRecurringItemDto }) => updateRecurringItem(id, data),
    onSuccess: () => {
      toast.success('Recurring item updated');
      queryClient.invalidateQueries({ queryKey: RECURRING_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: UPCOMING_QUERY_KEY });
      queryClient.invalidateQueries({ predicate: query => query.queryKey[0] === 'recurring-overview' });
    },
    onError: (err: Error) => toast.error(`Failed to update: ${err.message}`),
  });
}

export function useDeleteRecurringItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRecurringItem,
    onSuccess: () => {
      toast.success('Recurring item deleted');
      queryClient.invalidateQueries({ queryKey: RECURRING_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: UPCOMING_QUERY_KEY });
      queryClient.invalidateQueries({ predicate: query => query.queryKey[0] === 'recurring-overview' });
    },
    onError: (err: Error) => toast.error(`Failed to delete: ${err.message}`),
  });
}

export function useTriggerRecurringItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: triggerRecurringItem,
    onSuccess: () => {
      toast.success('Recurring item triggered');
      queryClient.invalidateQueries({ queryKey: RECURRING_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ predicate: query => query.queryKey[0] === 'recurring-overview' });
    },
    onError: (err: Error) => toast.error(`Failed to trigger: ${err.message}`),
  });
}

export function useSkipRecurringItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, occurrenceDate }: { id: string; occurrenceDate?: string }) =>
      skipRecurringItem(id, occurrenceDate),
    onSuccess: () => {
      toast.success('Recurring item skipped');
      queryClient.invalidateQueries({ queryKey: RECURRING_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: UPCOMING_QUERY_KEY });
      queryClient.invalidateQueries({ predicate: query => query.queryKey[0] === 'recurring-overview' });
    },
    onError: (err: Error) => toast.error(`Failed to skip: ${err.message}`),
  });
}
