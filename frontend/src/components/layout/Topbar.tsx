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

  return (
    <div className="bg-base-300 border-b border-base-content/20 text-base-content z-30">
      {/* Topbar Header */}
      <div className="h-16 flex justify-between items-center px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-1">
          <h1 className="text-xl font-bold">{title}</h1>

          {isExpensesPage && (
            <div className="flex items-center gap-2 text-sm text-base-content/80">
              <DatePickerControls
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 sm:gap-6 text-sm font-medium">
          <CurrencyDropdown />
          <ThemeDropdown />
        </div>
      </div>
    </div>
  );
}
