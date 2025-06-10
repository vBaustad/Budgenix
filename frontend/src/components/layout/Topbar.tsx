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
  <div className="h-14 flex justify-between items-center bg-[var(--color-gradient-start)] border-b border-base-content/20 text-base-content px-4 z-10">
    {/* LEFT: Title and Actions */}
    <div className="flex items-center gap-x-4">
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

    {/* RIGHT: Controls */}
    <div className="flex items-center gap-6 text-sm font-medium">
      <CurrencyDropdown />
      <ThemeDropdown />
    </div>
  </div>

  );
}
