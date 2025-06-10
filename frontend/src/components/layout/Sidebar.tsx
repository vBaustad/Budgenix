'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { sidebarNav } from '../../constants/SidebarNav'
import BudgenixLogo from '../../assets/Logo/BudgenixLogo.png'
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import type { SidebarItem, SidebarSection } from '@/types/shared/sidebar';
import { useUserQuery } from '@/features/user/hooks/useUserQuery';

function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { t } = useTranslation()
  const { logout } = useAuth()
  const { pathname } = useLocation()
  const { data: user, isLoading } = useUserQuery();
  const isActive = (path?: string) => pathname === path

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.length === 1
      ? parts[0].charAt(0).toUpperCase()
      : (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  };


  const itemClass = (path?: string, isLogout = false) =>
    classNames(
      'group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold',
      isLogout ? 'cursor-pointer' : '',
      isActive(path)
        ? 'bg-base-300 text-base-content font-bold'
        : 'text-primary-content/70 hover:bg-neutral hover:text-neutral-content'
    )

  return (
    <>
      {/* Mobile Sidebar */}
      <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop className="fixed inset-0 bg-base-300/80 transition-opacity duration-300 ease-linear" />
        <div className="fixed inset-0 flex">
          <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out">
            <TransitionChild>
              <div className="absolute top-0 left-full flex w-16 justify-center pt-5">
                <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                  <span className="sr-only">{t('sidebar.closeSidebar')}</span>
                  <XMarkIcon className="size-6 text-primary-content" />
                </button>
              </div>
            </TransitionChild>

            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary px-6 pb-2 ring-1 ring-primary-content/10">
              <div className="flex h-16 shrink-0 items-center">
                <img alt="Budgenix" src={BudgenixLogo} className="h-8 w-auto" />
              </div>

              <nav className="flex flex-1 flex-col">
                {sidebarNav.map((section) => (
                  <div key={section.section} className="mb-4">
                    <p className="text-xs text-primary-content/60 font-semibold uppercase mb-2">
                      {t(section.section)}
                    </p>
                    <ul className="-mx-2 space-y-1">
                      {section.items.map((item) => (
                        <li key={item.label}>
                          {item.action === 'logout' ? (
                            <button onClick={logout} className={itemClass(undefined, true)}>
                              <item.icon className="size-5 shrink-0" />
                              {t(item.label)}
                            </button>
                          ) : (
                            <a href={item.path} className={itemClass(item.path)}>
                              <item.icon className="size-5 shrink-0" aria-hidden="true" />
                              {t(item.label)}
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Desktop Sidebar */}
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-primary text-primary-content text-sm font-medium px-4 py-6">
      {/* Top Profile */}
      <div className="flex items-center gap-x-3">
        <div className="w-10 h-10 rounded-full bg-primary-content/20 text-primary-content flex items-center justify-center font-bold text-sm uppercase">
          {isLoading || !user ? '–' : getInitials(user.firstName) + getInitials(user.lastName)}
        </div>
        <div className="flex-1 leading-tight">
          <div className="text-sm font-medium text-primary-content">
            {isLoading || !user ? 'Loading...' : user.firstName + " " + user.lastName}
          </div>
          <div className="text-xs text-primary-content/70 truncate">
            {isLoading || !user ? '' : user.email}
          </div>
        </div>
      </div>


      {/* Navigation Sections */}
      <nav className="flex-1 flex flex-col gap-8 pt-4 overflow-y-auto">
        {sidebarNav.map((section: SidebarSection) => (
          <div key={section.section} className="space-y-1">
            <p className="text-xs font-semibold uppercase text-primary-content/50 tracking-wide mb-1 px-1">
              {t(section.section)}
            </p>
            <ul className="space-y-1">
              {section.items.map((item: SidebarItem) => (
                <li key={item.label}>
                  {item.action === 'logout' ? (
                    <button
                      onClick={logout}
                      className={classNames(
                        'flex items-center w-full gap-2 px-2 py-2 rounded-md transition',
                        'hover:bg-primary-content/10 text-primary-content/90'
                      )}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {t(item.label)}
                    </button>
                  ) : (
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
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>

    </>
  )
}
