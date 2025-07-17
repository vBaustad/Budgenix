import { useCurrency } from '@/context/CurrencyContext';
import { BudgetProgressDto } from '@/types/finance/budget';
import { formatCurrency } from '@/utils/formatting';
import { ArrowDownIcon, ArrowUpIcon, WalletIcon } from 'lucide-react';

type Props = {
  budgets: BudgetProgressDto[];
};

export default function BudgetOverview({ budgets }: Props) {
  const { currency } = useCurrency();

  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocatedAmount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.totalSpent, 0);
  const totalRemaining = totalAllocated - totalSpent;
  const isOverBudget = totalRemaining < 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-base-300 bg-base-100 p-6 rounded-xl overflow-hidden">
      {/* Allocated */}
      <div className="flex items-center gap-4 px-4 py-3">
        <WalletIcon className="w-6 h-6 text-primary" />
        <div>
          <div className="text-sm text-base-content/70">Allocated</div>
          <div className="text-xl font-semibold">
            {formatCurrency(totalAllocated, currency)}
          </div>
        </div>
      </div>

      {/* Spent */}
      <div className="flex items-center gap-4 px-4 py-3">
        <ArrowUpIcon className="w-6 h-6 text-warning" />
        <div>
          <div className="text-sm text-base-content/70">Spent</div>
          <div className="text-xl font-semibold">
            {formatCurrency(totalSpent, currency)}
          </div>
        </div>
      </div>

      {/* Remaining */}
      <div className="flex items-center gap-4 px-4 py-3">
        <ArrowDownIcon
          className={`w-6 h-6 ${isOverBudget ? 'text-error' : 'text-success'}`}
        />
        <div>
          <div className="text-sm text-base-content/70">Remaining</div>
          <div
            className={`text-xl font-semibold ${
              isOverBudget ? 'text-error' : 'text-success'
            }`}
          >
            {formatCurrency(totalRemaining, currency)}
          </div>
        </div>
      </div>
    </div>
  );
}
