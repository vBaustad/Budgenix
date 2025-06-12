import { ExpensesProvider } from '@/features/expenses/context/ExpensesContext';
import { IncomeProvider } from '@/features/Incomes/context/IncomesContext';
import { RecurringProvider } from './RecurringContext';
import { BudgetsProvider } from '@/features/budgets/context/BudgetsContext';

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  return (
    <IncomeProvider>
      <ExpensesProvider>
        <RecurringProvider>
          <BudgetsProvider>
            {children}
          </BudgetsProvider>
        </RecurringProvider>
      </ExpensesProvider>
    </IncomeProvider>
  );
}
