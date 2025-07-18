'use client';

import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSidebarNav  } from '../../constants/SidebarNav';
import BudgenixLogo from '../../assets/Logo/BudgenixLogo.png';
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type {  SidebarSection } from '@/types/shared/sidebar';
import { AppIcons } from '../icons/AppIcons';


function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  mobileSidebarOpen,
  setMobileSidebarOpen
}: {
  sidebarOpen: boolean;
  mobileSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setMobileSidebarOpen: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { pathname } = useLocation();

  const isActive = (path?: string) => pathname === path;

  return (
    <>
      {/* Mobile Sidebar */}
      <Dialog open={mobileSidebarOpen} onClose={setMobileSidebarOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop className="fixed inset-0 bg-base-300/50 backdrop-blur-xs transition-opacity" />
        <div className="fixed inset-0 flex">
          <DialogPanel className="relative flex w-full max-w-xs flex-1 transform bg-base-200 text-base-content p-4 ring-1 ring-base-300 transition duration-300 ease-in-out">
            <TransitionChild>
              <div className="absolute top-0 left-full flex w-16 justify-center pt-5">
                <button type="button" onClick={() => setMobileSidebarOpen(false)} className="-m-2.5 p-2.5">
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon aria-hidden="true" className="size-6 text-base-content" />
                </button>
              </div>
            </TransitionChild>

            <div className="flex grow flex-col gap-4 overflow-y-auto">
              <div className="flex h-16 items-center">
                <img src={BudgenixLogo} alt="Budgenix" className="h-8 w-auto" />
              </div>

              <nav className="flex-1 flex flex-col gap-4">
                <SidebarContent
                  t={t}
                  logout={logout}
                  isActive={isActive}
                  setMobileSidebarOpen={setMobileSidebarOpen}
                  sidebarOpen={true}
                />
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Desktop Sidebar */}
      <aside
        className={classNames(
          "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 transition-all duration-300 border-r border-base-300 bg-base-200 text-base-content text-sm font-medium",
          sidebarOpen ? "lg:w-72 px-2 py-2" : "lg:w-16 px-2 py-2"
        )}
      >
      <div className="relative group flex items-center justify-between h-12 w-full px-2">
        {sidebarOpen ? (
          <>
            {/* Full Sidebar: Logo + Hide Button */}
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src={BudgenixLogo} alt="Budgenix" className="h-6 w-auto" />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-base-content/60 hover:text-base-content"
            >
              <AppIcons.panelLeftClose className="w-5 h-5" />
            </button>
          </>
        ) : (
          <>
          <div className="relative group w-full flex justify-center items-center">
            {/* Toggle button: only shows on hover */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Open sidebar"
            >
              <AppIcons.panelLeftOpen className="w-5 h-5 text-base-content" />
            </button>

            {/* Logo: shown by default, hides on hover */}
            <Link
              to="/dashboard"
              className="transition-opacity group-hover:opacity-0 z-0"
            >
              <img src={BudgenixLogo} alt="Budgenix" className="h-6 w-auto" />
            </Link>
          </div>

          </>
        )}
      </div>



        <nav className="flex-1 flex flex-col gap-8 pt-4 overflow-y-auto">
          <SidebarContent
            t={t}
            logout={logout}
            isActive={isActive}
            sidebarOpen={sidebarOpen}
          />

        </nav>
      </aside>
    </>
  );
}

type SidebarContentProps = {
  t: (key: string) => string;
  logout: () => void;
  isActive: (path?: string) => boolean;
  setSidebarOpen?: (open: boolean) => void;
  sidebarOpen?: boolean;
  setMobileSidebarOpen?: (open: boolean) => void;
};


function SidebarContent({ t, logout, isActive, setSidebarOpen, sidebarOpen, setMobileSidebarOpen }: SidebarContentProps) {
  const navigate = useNavigate();
  const sidebarNav = useSidebarNav();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
    setSidebarOpen?.(false);
  };

  return (
    <>
      {sidebarNav.map((section: SidebarSection) => (
        <div key={section.section} className="space-y-1">
          {sidebarOpen && (
            <p className="text-xs font-semibold uppercase tracking-wide mb-1 px-1">
              {t(section.section)}
            </p>
          )}
          <ul className="space-y-1">
            {section.items.map((item) => {
              if ('action' in item && item.action === 'logout') {
                return (
                  <li key={item.label}>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full gap-2 px-2 py-2 rounded-md transition hover:bg-base-300 hover:text-base-content cursor-pointer">
                      <item.icon className="w-4 h-4 shrink-0" />
                        {sidebarOpen && <span>{t(item.label)}</span>}
                    </button>
                  </li>
                );
              }

              if ('path' in item) {
                return (
                  <li key={item.label}>
                    <Link
                      to={item.path}
                      onClick={() => {
                        setSidebarOpen?.(false);
                        setMobileSidebarOpen?.(false);
                      }}
                      
                      className={classNames(
                        'flex items-center gap-2 px-2 py-2 rounded-md transition-colors',
                        isActive(item.path)
                          ? 'bg-base-300 text-base-content'
                          : 'text-base-content/80 hover:bg-base-300 hover:text-base-content'
                      )}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      {sidebarOpen && <span>{t(item.label)}</span>}
                    </Link>

                  </li>
                );
              }

              return null;
            })}
          </ul>
        </div>
      ))}
    </>
  );
}
