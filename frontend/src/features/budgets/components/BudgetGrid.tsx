import { useBudgets } from '../context/BudgetsContext';
import BudgetCard from './BudgetCard';

type Props = {
  onAddClick: () => void;
};

export default function BudgetGrid({ onAddClick }: Props) {
  const { budgets, isLoading } = useBudgets();

  if (isLoading) {
    return (
      <div className="w-full text-center py-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Welcome to Budgets</h2>
        <p className="text-base-content/70 mb-6 max-w-md">
          Create your first budget and take control of your spending goals. You’ll be able to track how much you’ve used per category and get insights as you go.
        </p>
        <button className="btn btn-primary" onClick={onAddClick}>
          + Create First Budget
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {budgets.map((budget) => (
        <BudgetCard key={budget.id} budget={budget} />
      ))}
      <div className="col-span-full flex justify-center mt-2">
        <button className="btn btn-outline btn-primary" onClick={onAddClick}>
          + Add Budget
        </button>
      </div>
    </div>
  );
}
