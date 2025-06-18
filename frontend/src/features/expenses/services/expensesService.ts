import { Expense, GroupedExpenses, CreateExpenseDto } from '@/types/finance/expense';
import { apiFetch } from '@/utils/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


type FetchExpenseOptions = {
  from?: string;
  to?: string;
  categories?: string[];
  sort?: string;
  groupBy?: 'month' | 'year' | 'category';
};

type ExpensesOverviewResponse = {
  totalSpent: number;
  lastMonthSpent: number;
  incomeReceived: number;
  upcomingRecurring: number;
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

  return await apiFetch(`${API_BASE_URL}?${params.toString()}`);
}

async function fetchExpensesOverview(month: number, year: number): Promise<ExpensesOverviewResponse> {
  const params = new URLSearchParams({ month: String(month), year: String(year) });
  const res = await apiFetch(`/api/expenses/overview?${params}`);

  return {
    totalSpent: res.totalExpense,
    lastMonthSpent: res.lastMonthExpense,
    incomeReceived: res.incomeReceived,
    upcomingRecurring: res.upcomingRecurring,
    dailyTotals: res.dailyTotals,
  };
}

async function createExpenseApi(expense: CreateExpenseDto): Promise<Expense> {
  return await apiFetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...expense,
      description: expense.description || '',
    }),
  });
}

// === REACT QUERY HOOKS ===
export function useExpenses(filters: FetchExpenseOptions) {
  return useQuery<Expense[]>({
    queryKey: ['expenses', filters],
    queryFn: () => fetchExpenses(filters),
    staleTime: 5 * 60 * 1000,   // 5 minutes
    gcTime: 10 * 60 * 1000,
  });
}

export function useExpensesOverview(month: number | undefined, year: number | undefined) {
  return useQuery<ExpensesOverviewResponse>({
    queryKey: ['expensesOverview', month, year],
    queryFn: () => fetchExpensesOverview(month!, year!), // safe because enabled
    enabled: !!month && !!year, // don't run unless both provided
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}


export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpenseApi,
    onSuccess: () => {
      // Invalidate cached queries so data refreshes automatically
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expensesOverview'] });
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
