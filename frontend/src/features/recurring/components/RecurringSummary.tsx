import { RecurringItemDto } from '@/types/finance/recurring';
import { formatDate } from '@/utils/formatting';
import { AppIcons } from '@/components/icons/AppIcons';

type Props = {
  recurringItems: RecurringItemDto[];
  monthlyTotal: number;
  lastTriggered?: RecurringItemDto | null;
  lastSkipped?: RecurringItemDto | null;
};


export default function RecurringSummary({
  recurringItems,
  monthlyTotal,
  lastTriggered,
  lastSkipped,
}: Props) {
  const activeCount = recurringItems.filter(e => e.isActive).length;

  return (
    <div className="w-full bg-base-100 border border-base-200 rounded-xl shadow-sm p-4 space-y-4">
      <h3 className="text-xl text-primary font-semibold mb-1 flex items-center gap-2">
        <AppIcons.recurring className="w-5 h-5" />
        Recurring Summary
      </h3>

      <div className="text-sm text-base-content/80 space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">Active recurring:</span>
          <span>{activeCount}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">Monthly total:</span>
          <span>kr {monthlyTotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">Last triggered:</span>
          <span>{lastTriggered?.lastTriggeredDate ? formatDate(lastTriggered.lastTriggeredDate) : '—'}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">Last skipped:</span>
          <span>
            {lastSkipped?.lastSkippedDate
              ? `${formatDate(lastSkipped.lastSkippedDate)} – ${lastSkipped.name}`
              : '—'}
          </span>
        </div>
      </div>
    </div>
  );
}