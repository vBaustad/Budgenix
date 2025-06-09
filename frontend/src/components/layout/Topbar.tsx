import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { ThemeDropdown } from '../common/ThemeDropdown';
import CurrencyDropdown from '../common/CurrencyDropdown';
import { DatePickerControls } from '../common/DatePickerControls';
import { useDateFilter } from '@/context/DateFilterContext';

const routeTitles: Record<string, string> = {
  '/dashboard': 'topbar.dashboard',
  '/budgets': 'topbar.budgets',
  '/expenses': 'topbar.expenses',
  '/income': 'topbar.income',
  '/goals': 'topbar.goals',
  '/vacation-mode': 'topbar.vacation',
  '/reports': 'topbar.reports',
  '/settings': 'topbar.settings',
};

export default function Topbar() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const titleKey = routeTitles[pathname] || '';
  const title = t(titleKey);

  const isExpensesPage = pathname === '/expenses';
  const { selectedMonth, setSelectedMonth, selectedYear, setSelectedYear } = useDateFilter();

  const currentMonth = new Date(selectedYear, selectedMonth - 1).toLocaleString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="h-14 flex justify-between bg-base-200 border-b border-base-300">
      <div className="flex items-center p-4 gap-4">
        <h1 className="text-xl font-bold">{title}</h1>
        {isExpensesPage && (
          <DatePickerControls
            currentMonth={currentMonth}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
          />
        )}
      </div>
      <div className="flex items-center justify-end gap-6 text-sm font-medium text-base-content pr-4">
        <CurrencyDropdown />
        <ThemeDropdown />
      </div>
    </div>
  );
}
