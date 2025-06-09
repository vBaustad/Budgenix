import {
  Income,
  GroupedIncomes,
  CreateIncomeDto,
  IncomeOverviewDto
} from '@/types/finance/income';

type FetchIncomeOptions = {
  from?: string;
  to?: string;
  categories?: string[];
  sort?: string;
  groupBy?: 'month' | 'category' | 'year';
  skip?: number;
  take?: number;
};

const API_BASE_URL = '/api/incomes';

export async function fetchIncomes(filters: FetchIncomeOptions = {}): Promise<Income[] | GroupedIncomes> {
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

  if (!res.ok) throw new Error('Failed to fetch incomes');
  return await res.json();
}

export async function fetchIncomeOverview(
  month: number,
  year: number
): Promise<IncomeOverviewDto> {
  const params = new URLSearchParams({
    month: month.toString(),
    year: year.toString(),
  });

  const res = await fetch(`${API_BASE_URL}/overview?${params.toString()}`, {
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch income overview data');
  }

  return await res.json();
}

export function isGroupedIncomes(
  data: Income[] | GroupedIncomes
): data is GroupedIncomes {
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

export async function createIncome(income: CreateIncomeDto): Promise<Income> {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(income),
    credentials: 'include',
  });

  if (!response.ok) {
    let message = 'Failed to create income';
    try {
      const error = await response.json();
      console.error('Validation Error:', error);

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
