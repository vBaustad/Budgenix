import { useLocation } from 'react-router-dom';
import { DatePickerControls } from '../common/DatePickerControls';
import { useDateFilter } from '@/context/DateFilterContext';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { AppIcons } from '../icons/AppIcons';
import BankImportModal from '@/modules/bankStatements/components/BankImportModal';

export default function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { pathname } = useLocation();
  const isExpensesPage = pathname === '/expenses';
  const { selectedMonth, setSelectedMonth, selectedYear, setSelectedYear } = useDateFilter();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  return (
    <div className="bg-base-100 border-b border-base-200 text-base-content z-30 w-full">
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
          {/* Right side buttons */}
        <div className="flex items-center gap-4">
          {/* Import Button */}
          <button
            onClick={() => setShowImportModal(true)}
            className="btn btn-sm btn-outline"
          >
            📄 Import Statement
          </button>

          {/* Notification Bell */}
          <button className="btn btn-sm btn-ghost relative">
            <AppIcons.notification className="w-5 h-5" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="btn btn-sm btn-ghost"
            >
              <div className="avatar placeholder">
                <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                  <span>VB</span>
                </div>
              </div>
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-base-100 border border-base-300 rounded shadow-md z-50">
                <ul className="menu menu-sm">
                  <li><a href="/settings">Account Settings</a></li>
                  <li><button onClick={() => console.log('Logout')}>Logout</button></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {showImportModal && (
        <BankImportModal open={showImportModal} onClose={() => setShowImportModal(false)} />
      )}

    </div>
  );
}
