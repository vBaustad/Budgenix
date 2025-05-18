import { Expense, GroupedExpenses, CreateExpenseDto } from '../../types/finance/expense';



type FetchExpenseOptions = {
  from?: string; 
  to?: string; 
  categories?: string[];
  sort?: string;
  groupBy?: 'month' | 'category' | 'year';
  skip?: number;
  take?: number;
};


const API_BASE_URL = '/api/expenses';


export async function fetchExpenses(filters: FetchExpenseOptions = {}): Promise<Expense[] | GroupedExpenses> {
  const params = new URLSearchParams();

  if (filters.from) params.append('from', filters.from);
  if (filters.to) params.append('to', filters.to);
  if (filters.categories?.length) {
    params.append('categories', filters.categories.join(','));
  }
  if (filters.sort) params.append('sort', filters.sort);
  if (filters.groupBy) params.append('groupBy', filters.groupBy);
  if (filters.skip) params.append('skip', filters.skip.toString());
  if (filters.take) params.append('take', filters.take.toString());

  const res = await fetch(`${API_BASE_URL}?${params.toString()}`, {
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Failed to fetch expenses');
  return await res.json();
}


export function isGroupedExpenses(
  data: Expense[] | GroupedExpenses
): data is GroupedExpenses {
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

  console.log('Outgoing payload:', JSON.stringify(expense, null, 2));


  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expense),
    credentials: 'include',
  });

  if (!response.ok) {
    let message = 'Failed to create expense';
    try {
      const error = await response.json();
      console.error('Validation Error:', error);

      // Optional: grab a helpful error string
      if (error.errors) {
        const firstKey = Object.keys(error.errors)[0];
        message = `${firstKey}: ${error.errors[firstKey][0]}`;
      } else if (error.title) {
        message = error.title;
      }
    } catch (e) {
      console.error('Error parsing error response:', e);
    }

    throw new Error(message);
  }

  return await response.json();
}
