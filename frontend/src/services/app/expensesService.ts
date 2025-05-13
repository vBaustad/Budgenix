import { Expense, GroupedExpenses, GroupedExpenseItem } from '../../types/finance/expense';

type FetchExpenseOptions = {
  from?: string;       // ISO string
  to?: string;         // ISO string
  category?: string;   // Category ID
  sort?: string;
  groupBy?: 'month' | 'category' | 'year';
  skip?: number;
  take?: number;
};

  export async function fetchExpenses(filters: FetchExpenseOptions = {}): Promise<Expense[] | GroupedExpenses> {
    const params = new URLSearchParams();

    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);
    if (filters.category) params.append('category', filters.category);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.groupBy) params.append('groupBy', filters.groupBy);
    if (filters.skip) params.append('skip', filters.skip.toString());
    if (filters.take) params.append('take', filters.take.toString());

  const res = await fetch(`/api/expenses?${params.toString()}`, {
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Failed to fetch expenses');
  return await res.json();
}

export async function fetchUsedCategories(): Promise<string[]> {
    const response = await fetch('/api/expenses/categories', {
      credentials: 'include',
    });
  
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json(); // returns string[]
  }
  

  export function isGroupedExpenses(
    data: Expense[] | GroupedExpenses
  ): data is GroupedExpenses {
    return (
      Array.isArray(data) &&
      data.length > 0 &&
      typeof data[0] === 'object' &&
      data[0] !== null &&
      'group' in data[0] &&
      'expenses' in data[0] &&
      Array.isArray((data[0] as GroupedExpenseItem).expenses)
    );
  }
  