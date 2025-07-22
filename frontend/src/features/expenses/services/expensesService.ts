import {
  Expense,
  GroupedExpenses,
  CreateExpenseDto,
  UpdateExpenseDto
} from '@/types/finance/expense';
import { apiFetch } from '@/utils/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';

type FetchExpenseOptions = {
  from?: string;
  to?: string;
  categories?: string[];
  sort?: string;
  groupBy?: 'month' | 'year' | 'category';
};

type ExpensesOverviewApiResponse = {
  totalExpense: number;
  lastMonthExpense: number;
  incomeReceived: number;
  dailyTotals: { day: number; total: number }[];
};

type ExpensesOverviewResponse = {
  totalSpent: number;
  lastMonthSpent: number;
  incomeReceived: number;
  dailyTotals: { day: number; total: number }[];
};

const API_BASE_URL = '/api/expenses';

// === RAW FETCHERS ===
export async function fetchExpenses(filters: FetchExpenseOptions = {}): Promise<Expense[]> {
  const params = new URLSearchParams();

  if (filters.from) params.append('from', filters.from);
  if (filters.to) params.append('to', filters.to);
  if (filters.categories?.length) {
    filters.categories.forEach(c => params.append('categoryIds', c));
  }
  if (filters.sort) params.append('sort', filters.sort);

  const result = await apiFetch<Expense[]>(`${API_BASE_URL}?${params.toString()}`);
  if (!result) throw new Error('Failed to fetch expenses');
  return result;
}

async function fetchExpensesOverview(month: number, year: number): Promise<ExpensesOverviewResponse> {
  const params = new URLSearchParams({ month: String(month), year: String(year) });

  const res = await apiFetch<ExpensesOverviewApiResponse>(`/api/expenses/overview?${params}`);
  if (!res) throw new Error('Failed to fetch expenses overview');

  return {
    totalSpent: res.totalExpense,
    lastMonthSpent: res.lastMonthExpense,
    incomeReceived: res.incomeReceived,
    dailyTotals: res.dailyTotals,
  };
}

async function createExpenseApi(expense: CreateExpenseDto): Promise<Expense> {
  const result = await apiFetch<Expense | null>(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...expense,
      description: expense.description || '',
    }),
  });

  if (!result) throw new Error('Failed to create expense');
  return result;
}

async function updateExpenseApi({
  id,
  data,
}: {
  id: string;
  data: UpdateExpenseDto;
}): Promise<Expense> {
  const result = await apiFetch<Expense | null>(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!result) {
    throw new Error('Failed to update expense');
  }

  return result;
}



async function deleteExpenseApi({
  id,
}: {
  id: string;
  date: string;
}): Promise<void> {
  await apiFetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
}



// === REACT QUERY HOOKS ===
export function useExpenses(filters: FetchExpenseOptions) {
  const { isLoggedIn } = useAuth();

  return useQuery<Expense[]>({
    queryKey: ['expenses', filters],
    queryFn: () => fetchExpenses(filters),
    enabled: isLoggedIn,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useExpensesOverview(month: number | undefined, year: number | undefined) {
  const { isLoggedIn } = useAuth();

  return useQuery<ExpensesOverviewResponse>({
    queryKey: ['expensesOverview', month, year],
    queryFn: () => fetchExpensesOverview(month!, year!),
    enabled: isLoggedIn && !!month && !!year,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpenseApi,
    onSuccess: (createdExpense) => {
      const date = new Date(createdExpense.date);
      const month = date.getMonth() + 1;      
      const year = date.getFullYear();

      const lastMonth = month === 1 ? 12 : month - 1;
      const lastMonthYear = month === 1 ? year - 1 : year;

      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({queryKey: ['expensesOverview', month, year]});
      queryClient.invalidateQueries({queryKey: ['expensesOverview', lastMonth, lastMonthYear]});
      queryClient.invalidateQueries({queryKey: ['dashboardSummary', month, year]});
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; data: UpdateExpenseDto }) => updateExpenseApi(payload),
      onSuccess: (updatedExpense) => {
        const date = new Date(updatedExpense.date);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const lastMonth = month === 1 ? 12 : month - 1;
        const lastMonthYear = month === 1 ? year - 1 : year;

        queryClient.invalidateQueries({ queryKey: ['expenses'] });
        queryClient.invalidateQueries({ queryKey: ['expensesOverview', month, year] });
        queryClient.invalidateQueries({ queryKey: ['expensesOverview', lastMonth, lastMonthYear] });
        queryClient.invalidateQueries({ queryKey: ['dashboardSummary', month, year] });
      },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExpenseApi,
    onSuccess: (_, { date }) => {
      const d = new Date(date);
      const month = d.getMonth() + 1;
      const year = d.getFullYear();
      const lastMonth = month === 1 ? 12 : month - 1;
      const lastMonthYear = month === 1 ? year - 1 : year;

      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expensesOverview', month, year] });
      queryClient.invalidateQueries({ queryKey: ['expensesOverview', lastMonth, lastMonthYear] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary', month, year] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary', lastMonth, lastMonthYear] });
    },
  });
}


// === UTILITY ===
export function isGroupedExpenses(data: Expense[] | GroupedExpenses): data is GroupedExpenses {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    typeof data[0] === 'object' &&
    data[0] !== null &&
    'groupName' in data[0] &&
    'expenses' in data[0] &&
    Array.isArray(data[0].expenses)
  );
}
