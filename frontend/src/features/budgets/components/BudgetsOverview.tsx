import { useCurrency } from '@/context/CurrencyContext';
import { BudgetProgressItem } from '@/types/finance/budget';
import { formatCurrency } from '@/utils/formatting';
import { ArrowDownIcon, ArrowUpIcon, WalletIcon } from 'lucide-react';

type Props = {
  budgets: BudgetProgressItem[];
};

export default function BudgetOverview({ budgets }: Props) {
  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocatedAmount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.totalSpent, 0);
  const totalRemaining = totalAllocated - totalSpent;
  const isOverBudget = totalRemaining < 0;
  const { currency } = useCurrency();
  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-base-100 p-6 rounded-xl shadow items-center">
      <div className="flex items-center gap-4">
        <WalletIcon className="w-6 h-6 text-primary" />
        <div>
          <div className="text-sm text-base-content/70">Allocated</div>
          <div className="text-xl font-semibold">{formatCurrency(totalAllocated, currency)}</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ArrowUpIcon className="w-6 h-6 text-warning" />
        <div>
          <div className="text-sm text-base-content/70">Spent</div>
          <div className="text-xl font-semibold">{formatCurrency(totalSpent, currency)}</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ArrowDownIcon className={`w-6 h-6 ${isOverBudget ? 'text-error' : 'text-success'}`} />
        <div>
          <div className="text-sm text-base-content/70">Remaining</div>
          <div className={`text-xl font-semibold ${isOverBudget ? 'text-error' : ''}`}>
            {formatCurrency(totalRemaining, currency)}
          </div>
        </div>
      </div>
    </div>
  );
}
