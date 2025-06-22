import { RecurringItemDto } from '@/types/finance/recurring';

export default function RecurringSummary({
  recurringItems = [], // default to empty array
  monthlyTotal = 0,
  lastTriggered,
  lastSkipped,
}: {
  recurringItems?: RecurringItemDto[];
  monthlyTotal?: number;
  lastTriggered?: RecurringItemDto | null;
  lastSkipped?: RecurringItemDto | null;
}) {
  // Safe to use .filter now!
  const activeItems = recurringItems.filter((item) => item.isActive);

  return (
    <div className="space-y-2">
      <div>Total: {monthlyTotal}</div>
      <div>Active items: {activeItems.length}</div>
      {lastTriggered && (
        <div>Last triggered: {lastTriggered.name}</div>
      )}
      {lastSkipped && (
        <div>Last skipped: {lastSkipped.name}</div>
      )}
    </div>
  );
}
