'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { sidebarNav } from '../../constants/SidebarNav';
import BudgenixLogo from '../../assets/Logo/BudgenixLogo.png';
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { SidebarItem, SidebarSection } from '@/types/shared/sidebar';
import { useUserQuery } from '@/features/user/hooks/useUserQuery';

function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { pathname } = useLocation();
  const { data: user, isLoading } = useUserQuery();

  const isActive = (path?: string) => pathname === path;

  const getInitials = (first: string, last: string) =>
    `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();

  return (
    <>
      {/* Mobile Sidebar */}
      <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="lg:hidden z-50 relative">
        <DialogBackdrop className="fixed inset-0 bg-base-300/80 transition-opacity" />
        <div className="fixed inset-0 flex">
          <DialogPanel className="relative flex flex-1 max-w-xs bg-primary p-6 ring-1 ring-primary-content/10">
            <TransitionChild>
              <div className="absolute top-0 left-full flex w-16 justify-center pt-5">
                <button onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                  <XMarkIcon className="size-6 text-primary-content" />
                </button>
              </div>
            </TransitionChild>

            <div className="flex flex-col grow gap-6 overflow-y-auto">
              <img src={BudgenixLogo} alt="Budgenix" className="h-8 w-auto" />
              <SidebarContent
                t={t}
                logout={logout}
                isActive={isActive}
              />
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-primary text-primary-content px-4 py-6 text-sm font-medium">
        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-content/20 flex items-center justify-center font-bold text-sm uppercase">
            {isLoading || !user ? '–' : getInitials(user.firstName, user.lastName)}
          </div>
          <div className="leading-tight">
            <div className="font-medium">
              {isLoading || !user ? 'Loading...' : `${user.firstName} ${user.lastName}`}
            </div>
            <div className="text-xs text-primary-content/70 truncate">
              {user?.email}
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-8 pt-4 overflow-y-auto">
          <SidebarContent t={t} logout={logout} isActive={isActive} />
        </nav>
      </aside>
    </>
  );
}

type SidebarContentProps = {
  t: (key: string) => string;
  logout: () => void;
  isActive: (path?: string) => boolean;
};

function SidebarContent({ t, logout, isActive }: SidebarContentProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };


  return (
    <>
      {sidebarNav.map((section: SidebarSection) => (
        <div key={section.section} className="space-y-1">
          <p className="text-xs font-semibold uppercase text-primary-content/50 tracking-wide mb-1 px-1">
            {t(section.section)}
          </p>
          <ul className="space-y-1">
            {section.items.map((item) => {
              if ('collapsible' in item && item.collapsible) {
                return (
                  <SidebarCollapsibleItem
                    key={item.label}
                    item={item}
                    isActive={isActive}
                    t={t}
                  />
                );
              }

              if ('action' in item && item.action === 'logout') {
                return (
                  <li key={item.label}>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full gap-2 px-2 py-2 rounded-md transition hover:bg-primary-content/10 text-primary-content/90"
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {t(item.label)}
                    </button>
                  </li>
                );
              }

              if ('path' in item) {
                return (
                  <li key={item.label}>
                    <a
                      href={item.path}
                      className={classNames(
                        'flex items-center gap-2 px-2 py-2 rounded-md transition',
                        isActive(item.path)
                          ? 'bg-base-100 text-base-content font-semibold'
                          : 'hover:bg-primary-content/10 text-primary-content/90'
                      )}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {t(item.label)}
                    </a>
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

function SidebarCollapsibleItem({
  item,
  isActive,
  t,
}: {
  item: SidebarItem;
  isActive: (path?: string) => boolean;
  t: (key: string) => string;
}) {
  const isInitiallyOpen =
    'children' in item && Array.isArray(item.children)
      ? item.children.some((child) => isActive(child.path))
      : false;

  const [open, setOpen] = useState(isInitiallyOpen);

  if (!('children' in item)) return null;


  return (
    <li>
      <button
        onClick={() => setOpen((prev: boolean) => !prev)}
        className={classNames(
          'flex items-center justify-between w-full px-2 py-2 rounded-md transition',
          'hover:bg-primary-content/10 text-primary-content/90',
          open && 'bg-primary-content/10'
        )}
      >
        <span className="flex items-center gap-2">
          <item.icon className="w-4 h-4 shrink-0" />
          {t(item.label)}
        </span>
        <span className="text-xs">{open ? '▾' : '▸'}</span>
      </button>

      {open && (
        <ul className="mt-1 ml-6 space-y-1">
          {item.children.map((child) => (
            <li key={child.label}>
              <a
                href={child.path}
                className={classNames(
                  'flex items-center gap-2 px-2 py-1 rounded-md text-sm transition',
                  isActive(child.path)
                    ? 'bg-base-100 text-base-content font-semibold'
                    : 'hover:bg-primary-content/10 text-primary-content/80'
                )}
              >
                <child.icon className="w-4 h-4 shrink-0" />
                {t(child.label)}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

