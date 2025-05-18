import { Expense } from "../../types/finance/expense";
import { RecurringExpenseDto } from "../../types/finance/recurring";

const RECURRING_API_BASE = '/api/recurring';

export async function fetchUpcomingRecurring(): Promise<{
    id: string;
    name: string;
    amount: number;
    startDate: string;
    frequency: string;
    nextOccurrenceDate: string;
  }[]> {
    const res = await fetch(`${RECURRING_API_BASE}/recurring`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch recurring items');
    return res.json();
  }
  
  
export async function fetchRecurringExpenses(): Promise<RecurringExpenseDto[]> {
  const res = await fetch(`${RECURRING_API_BASE}/upcoming`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch upcoming recurring expenses');
  return res.json();
}

export async function updateRecurringItem(item: RecurringExpenseDto): Promise<void> {
  const payload = {
    name: item.name,
    description: item.description ?? '',
    amount: item.amount,
    startDate: item.startDate,
    endDate: item.endDate || null,
    frequency: item.frequency,
    isActive: item.isActive,
    type: item.type,
    categoryId: item.categoryId,
  };

  const res = await fetch(`/api/recurring/${item.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to update item: ${error}`);
  }
}

export async function triggerRecurringItem(id: string): Promise<Expense> {
  const res = await fetch(`/api/recurring/${id}/trigger`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to trigger recurring item');
  }

  return res.json();
}

export async function skipRecurringItem(id: string): Promise<void> {
  const res = await fetch(`/api/recurring/${id}/skip`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to skip recurring item');
  }
}


export async function deleteRecurringItem(id: string): Promise<void> {
  const res = await fetch(`${RECURRING_API_BASE}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to delete item: ${error}`);
  }
}
