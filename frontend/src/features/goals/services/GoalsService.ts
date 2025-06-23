import { apiFetch } from '@/utils/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  GoalDto,
  CreateGoalDto,
  UpdateGoalDto,
  GoalContributionDto
} from '@/types/finance/goal';
import { useAuth } from '@/context/AuthContext'; // 👈 added

const API_BASE_URL = '/api/goals';

// === RAW FETCHERS ===
export async function fetchGoals(activeOnly?: boolean): Promise<GoalDto[]> {
  const params = new URLSearchParams();
  if (activeOnly !== undefined) params.append('activeOnly', String(activeOnly));

  return await apiFetch(`/api/goals?${params.toString()}`);
}

async function createGoalApi(goal: CreateGoalDto): Promise<GoalDto> {
  return await apiFetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goal),
  });
}

async function updateGoalApi({
  id,
  data,
}: {
  id: string;
  data: UpdateGoalDto;
}): Promise<void> {
  await apiFetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

async function deleteGoalApi(id: string): Promise<void> {
  await apiFetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
}

async function contributeGoalApi({
  id,
  data,
}: {
  id: string;
  data: GoalContributionDto;
}): Promise<void> {
  await apiFetch(`${API_BASE_URL}/${id}/contribute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// === REACT QUERY HOOKS ===
export function useGoals(activeOnly?: boolean) {
  const { isLoggedIn } = useAuth(); // 👈
  return useQuery<GoalDto[]>({
    queryKey: ['goals', activeOnly],
    queryFn: ({ queryKey }) => {
      const [, activeOnlyVal] = queryKey as [string, boolean?];
      return fetchGoals(activeOnlyVal);
    },
    enabled: isLoggedIn, // 👈 prevents firing when logged out
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGoalApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; data: UpdateGoalDto }) => updateGoalApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGoalApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}

export function useContributeGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; data: GoalContributionDto }) => contributeGoalApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}
