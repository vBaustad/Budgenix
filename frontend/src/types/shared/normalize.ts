import { RecurrenceFrequency } from "../shared/recurrence";

export function normalizeMonthly(amount: number, frequency: RecurrenceFrequency): number {
  switch (frequency) {
    case 'Daily': return Math.round((amount * 365) / 12);
    case 'Weekly': return Math.round((amount * 52) / 12);
    case 'BiWeekly': return Math.round((amount * 26) / 12);
    case 'Monthly': return amount;
    case 'Quarterly': return Math.round((amount * 4) / 12);
    case 'Yearly': return Math.round(amount / 12);
    default: return 0;
  }
}
