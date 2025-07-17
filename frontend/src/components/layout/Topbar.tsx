import { useLocation } from 'react-router-dom';
import { DatePickerControls } from '../common/DatePickerControls';
import { useDateFilter } from '@/context/DateFilterContext';
import { Bars3Icon } from '@heroicons/react/24/outline';

export default function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { pathname } = useLocation();
  const isExpensesPage = pathname === '/expenses';
  const { selectedMonth, setSelectedMonth, selectedYear, setSelectedYear } = useDateFilter();

  return (
    <div className="bg-primary text-base-content z-30 w-full">
      <div className="h-16 flex items-center justify-between px-4 sm:px-6 w-full max-w-full">
        {/* Left: hamburger always visible on mobile */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded hover:bg-base-content/10"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="w-6 h-6" />
          </button>

          {/* Show date picker on expenses page */}
          {isExpensesPage && (
            <DatePickerControls
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
            />
          )}
        </div>

        {/* Center: Search bar only on large screens */}
        <div className="hidden lg:flex justify-center flex-1">
          <input
            type="text"
            placeholder="Search..."
            className="bg-base-100 h-10 px-5 pr-10 w-xl rounded-full text-sm outline outline-primary/70"
          />
        </div>

        {/* Right: Empty spacer to balance layout */}
        <div className="flex-1 hidden lg:block" />
      </div>
    </div>
  );
}
