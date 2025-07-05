import { ExpensesProvider } from '@/features/expenses/context/ExpensesContext';
import { IncomeProvider } from '@/features/Incomes/context/IncomesContext';
import { RecurringProvider } from './RecurringContext';
import { BudgetsProvider } from '@/features/budgets/context/BudgetsContext';
import { useDateFilter } from './DateFilterContext';
import { CashflowProvider } from '@/features/cashflows/context/CashflowContext';

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const { selectedMonth, selectedYear } = useDateFilter();
  
  return (
    <IncomeProvider month={selectedMonth} year={selectedYear}>
      <ExpensesProvider month={selectedMonth} year={selectedYear}>
        <RecurringProvider>
          <BudgetsProvider>
            <CashflowProvider>
              {children}
            </CashflowProvider>
          </BudgetsProvider>
        </RecurringProvider>
      </ExpensesProvider>
    </IncomeProvider>
  );
}
