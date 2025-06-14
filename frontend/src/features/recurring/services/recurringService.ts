import { apiFetch } from '@/utils/api';
import { Expense } from "@/types/finance/expense";
import { CreateRecurringItemDto, RecurringItemDto } from '@/types/finance/recurring';

const RECURRING_API_BASE = '/api/recurring';

export async function fetchUpcomingRecurring(): Promise<{
  id: string;
  name: string;
  amount: number;
  startDate: string;
  frequency: string;
  nextOccurrenceDate: string;
}[]> {
  const res = await apiFetch(`${RECURRING_API_BASE}/recurring`);
  return res.json();
}

export async function fetchRecurringExpenses(): Promise<RecurringItemDto[]> {
  const res = await apiFetch(`${RECURRING_API_BASE}/upcoming`);
  return res.json();
}

export async function createRecurringItem(data: CreateRecurringItemDto): Promise<RecurringItemDto> {
  const res = await apiFetch(RECURRING_API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to create recurring item: ${error}`);
  }

  return res.json();
}

export async function updateRecurringItem(item: RecurringItemDto): Promise<void> {
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

  const res = await apiFetch(`${RECURRING_API_BASE}/${item.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to update item: ${error}`);
  }
}

export async function triggerRecurringItem(id: string): Promise<Expense> {
  const res = await apiFetch(`${RECURRING_API_BASE}/${id}/trigger`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to trigger recurring item');
  }

  return res.json();
}

export async function skipRecurringItem(id: string): Promise<void> {
  const res = await apiFetch(`${RECURRING_API_BASE}/${id}/skip`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to skip recurring item');
  }
}

export async function deleteRecurringItem(id: string): Promise<void> {
  const res = await apiFetch(`${RECURRING_API_BASE}/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to delete item: ${error}`);
  }
}
