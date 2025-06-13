import { Expense, GroupedExpenses, CreateExpenseDto } from '@/types/finance/expense';
import { apiFetch } from '@/utils/api';

type FetchExpenseOptions = {
  from?: string;
  to?: string;
  categories?: string[];
  sort?: string;
  groupBy?: 'month' | 'category' | 'year';
  skip?: number;
  take?: number;
};

type ExpensesOverviewResponse = {
  totalSpent: number;
  lastMonthSpent: number;
  incomeReceived: number;
  upcomingRecurring: number;
  dailyTotals: number[];
};

const API_BASE_URL = '/api/expenses';

export async function fetchExpenses(filters: FetchExpenseOptions = {}): Promise<Expense[] | GroupedExpenses> {
  const params = new URLSearchParams();

  if (filters.from) params.append('from', filters.from);
  if (filters.to) params.append('to', filters.to);
  if (filters.categories?.length) params.append('categories', filters.categories.join(','));
  if (filters.sort) params.append('sort', filters.sort);
  if (filters.groupBy) params.append('groupBy', filters.groupBy);
  if (filters.skip) params.append('skip', filters.skip.toString());
  if (filters.take) params.append('take', filters.take.toString());

  return await apiFetch(`${API_BASE_URL}?${params.toString()}`);
}

export async function fetchExpensesOverview(month: number, year: number): Promise<ExpensesOverviewResponse> {
  const params = new URLSearchParams({
    month: month.toString(),
    year: year.toString(),
  });

  return await apiFetch(`${API_BASE_URL}/overview?${params.toString()}`);
}

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

export async function createExpense(expense: CreateExpenseDto): Promise<Expense> {
  try {
    return await apiFetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...expense,
        description: expense.description || '',
      }),
    });
  } catch (err: unknown) {
    // Reproduce the original enhanced error handling
    if (err instanceof Response) {
      try {
        const error = await err.json();
        if (error?.errors) {
          const firstKey = Object.keys(error.errors)[0];
          throw new Error(`${firstKey}: ${error.errors[firstKey][0]}`);
        } else if (error?.title) {
          throw new Error(error.title);
        }
      } catch (parseErr) {
        console.error('Error parsing error response:', parseErr);
      }
    }
    throw new Error('Failed to create expense');
  }
}
