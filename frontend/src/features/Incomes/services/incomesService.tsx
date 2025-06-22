import { apiFetch } from '@/utils/api';
import {
  Income,
  GroupedIncomes,
  CreateIncomeDto,
  IncomeOverviewDto,
  UpdateIncomeDto
} from '@/types/finance/income';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDateFilter } from '@/context/DateFilterContext';

type FetchIncomeOptions = {
  from?: string;
  to?: string;
  categories?: string[];
  sort?: string;
};

const API_BASE_URL = '/api/incomes';

// === RAW FETCHERS ===
async function fetchIncomes(filters: FetchIncomeOptions = {}): Promise<Income[]> {
  const params = new URLSearchParams();

  if (filters.from) params.append('from', filters.from);
  if (filters.to) params.append('to', filters.to);
  if (filters.categories?.length) {
    filters.categories.forEach(c => params.append('categoryIds', c));
  }
  if (filters.sort) params.append('sort', filters.sort);

  return await apiFetch(`${API_BASE_URL}?${params.toString()}`);
}

async function fetchIncomeOverview(month: number, year: number): Promise<IncomeOverviewDto> {
  const params = new URLSearchParams({
    month: String(month),
    year: String(year),
  });
  return await apiFetch(`${API_BASE_URL}/overview?${params}`);
}

async function createIncomeApi(income: CreateIncomeDto): Promise<Income> {
  return await apiFetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(income),
  });
}

async function updateIncomeApi({
  id,
  data,
}: {
  id: string;
  data: UpdateIncomeDto;
}): Promise<void> {
  await apiFetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}


async function deleteIncomeApi(id: string): Promise<void> {
  await apiFetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
}

// === REACT QUERY HOOKS ===
export function useIncomes(filters: FetchIncomeOptions) {
  return useQuery<Income[]>({
    queryKey: ['incomes', filters],
    queryFn: () => fetchIncomes(filters),
    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: 10 * 60 * 1000,    // 10 minutes
  });
}

export function useIncomeOverview() {
  const { selectedMonth: month, selectedYear: year } = useDateFilter();
  
  return useQuery<IncomeOverviewDto>({
    queryKey: ['incomeOverview', month, year],
    queryFn: () => fetchIncomeOverview(month!, year!), 
    enabled: !!month && !!year,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateIncome() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createIncomeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      queryClient.invalidateQueries({ queryKey: ['incomeOverview'] });
    },
  });
}

export function useUpdateIncome() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; data: UpdateIncomeDto }) => updateIncomeApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      queryClient.invalidateQueries({ queryKey: ['incomesOverview'] });
    },
  });
}


export function useDeleteIncome() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteIncomeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      queryClient.invalidateQueries({ queryKey: ['incomesOverview'] });
    },
  });
}


// === UTILITY ===
export function isGroupedIncomes(data: Income[] | GroupedIncomes): data is GroupedIncomes {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    typeof data[0] === 'object' &&
    data[0] !== null &&
    'groupName' in data[0] &&
    'incomes' in data[0] &&
    Array.isArray(data[0].incomes)
  );
}
