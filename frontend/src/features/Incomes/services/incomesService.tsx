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
import { useAuth } from '@/context/AuthContext';

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

  const result = await apiFetch<Income[]>(`${API_BASE_URL}?${params.toString()}`);
  if (!result) throw new Error('Failed to fetch incomes');
  return result;
}

async function fetchIncomeOverview(month: number, year: number): Promise<IncomeOverviewDto> {
  const params = new URLSearchParams({
    month: String(month),
    year: String(year),
  });

  const result = await apiFetch<IncomeOverviewDto>(`${API_BASE_URL}/overview?${params.toString()}`);
  if (!result) throw new Error('Failed to fetch income overview');
  return result;
}

async function createIncomeApi(income: CreateIncomeDto): Promise<Income> {
  const result = await apiFetch<Income>(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(income),
  });

  if (!result) {
    throw new Error('Failed to create income');
  }

  return result;
}

async function updateIncomeApi({
  id,
  data,
}: {
  id: string;
  data: UpdateIncomeDto;
}): Promise<Income> {
  const result = await apiFetch<Income>(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

   if (!result) {
    throw new Error('Failed to update income');
  }

  return result;
}


async function deleteIncomeApi(id: string): Promise<void> {
  await apiFetch<void>(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
}

// === REACT QUERY HOOKS ===
export function useIncomes(filters: FetchIncomeOptions) {
  const { isLoggedIn } = useAuth();

  return useQuery<Income[]>({
    queryKey: ['incomes', filters],
    queryFn: () => fetchIncomes(filters),
    enabled: isLoggedIn,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useIncomeOverview() {
  const { isLoggedIn } = useAuth();
  const { selectedMonth: month, selectedYear: year } = useDateFilter();

  return useQuery<IncomeOverviewDto>({
    queryKey: ['incomeOverview', month, year],
    queryFn: () => fetchIncomeOverview(month!, year!),
    enabled: isLoggedIn && !!month && !!year,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateIncome() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createIncomeApi,
    onSuccess: (createdIncome) => {

      const date = new Date(createdIncome.date);
      const month = date.getMonth() + 1;      
      const year = date.getFullYear();

      const lastMonth = month === 1 ? 12 : month - 1;
      const lastMonthYear = month === 1 ? year - 1 : year;


      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      queryClient.invalidateQueries({ queryKey: ['incomeOverview', month, year] });
      queryClient.invalidateQueries({ queryKey: ['incomeMonthlySummary', month, year]});
      queryClient.invalidateQueries({ queryKey: ['incomeMonthlySummary', lastMonth, lastMonthYear]});
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary', month, year]})
    },
  });
}

export function useUpdateIncome() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; data: UpdateIncomeDto }) => updateIncomeApi(payload),
    onSuccess: (updateIncome) => {
        const date = new Date(updateIncome.date);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const lastMonth = month === 1 ? 12 : month - 1;
        const lastMonthYear = month === 1 ? year - 1 : year;

      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      queryClient.invalidateQueries({ queryKey: ['incomeOverview', month, year] });
      queryClient.invalidateQueries({ queryKey: ['incomeMonthlySummary', month, year]});
      queryClient.invalidateQueries({ queryKey: ['incomeMonthlySummary', lastMonth, lastMonthYear]});
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary', month, year]})
    },
  });
}

export function useDeleteIncome() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, date }: { id: string; date: string }) => {
      await deleteIncomeApi(id);
      return date;
    },
    onSuccess: (deletedDate) => {
      const date = new Date(deletedDate);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const lastMonth = month === 1 ? 12 : month - 1;
      const lastMonthYear = month === 1 ? year - 1 : year;

      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      queryClient.invalidateQueries({ queryKey: ['incomeOverview', month, year] });
      queryClient.invalidateQueries({ queryKey: ['incomeMonthlySummary', month, year] });
      queryClient.invalidateQueries({ queryKey: ['incomeMonthlySummary', lastMonth, lastMonthYear] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary', month, year] });
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
