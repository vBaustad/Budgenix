import { RecurrenceFrequency } from '../shared/recurrence';

// Used for displaying items
export type RecurringExpenseDto = {
  id: string;
  name: string;
  amount: number;
  startDate: string;
  endDate?: string;
  frequency: RecurrenceFrequency;
  isActive: boolean;
  nextOccurrenceDate: string;
};

// Used when creating/updating an item
export type RecurringItemFormDto = {
  name: string;
  amount: number;
  startDate: string;
  endDate?: string;
  frequency: RecurrenceFrequency;
  isActive: boolean;
};
