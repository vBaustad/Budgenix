import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { DatePickerControls } from '../common/DatePickerControls';
import { useDateFilter } from '@/context/DateFilterContext';
import { Bars3Icon } from '@heroicons/react/24/outline';

const routeTitles: Record<string, string> = {
  '/dashboard': 'topbar.dashboard',
  '/budgets': 'topbar.budgets',
  '/expenses': 'topbar.expenses',
  '/income': 'topbar.income',
  '/cashflow': 'topbar.cashflow',
  '/goals': 'topbar.goals',
  '/vacation-mode': 'topbar.vacation',
  '/reports': 'topbar.reports',
  '/settings': 'topbar.settings',
};

export default function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const titleKey = routeTitles[pathname] || '';
  const title = t(titleKey);

  const isExpensesPage = pathname === '/expenses';
  const { selectedMonth, setSelectedMonth, selectedYear, setSelectedYear } = useDateFilter();

  return (
    <div className="bg-base-300 border-b border-base-content/20 text-base-content z-30 w-full overflow-hidden">
      <div className="h-16 flex items-center px-4 sm:px-6 w-full max-w-full overflow-hidden">
        {/* Left side: flexible, can shrink */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <h1 className="text-lg font-bold truncate">{title}</h1>

          {isExpensesPage && (
            <div className="min-w-0 overflow-hidden">
              <DatePickerControls
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
              />
            </div>
          )}
        </div>


        {/* Right side: hamburger always visible */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded hover:bg-base-content/10 flex-shrink-0 ml-2"
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="w-6 h-6" />
      </button>

      </div>
    </div>

  );
}
