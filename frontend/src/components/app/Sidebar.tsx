'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import { sidebarNav } from '../../constants/SidebarNav'
import GradientSeparator from '../common/GradientSeparator'
import BudgenixLogo from '../../assets/Logo/BudgenixLogo.png'
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { t } = useTranslation()
  const { logout } = useAuth()

  return (
    <>
      {/* Mobile Sidebar */}
      <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear" />
        <div className="fixed inset-0 flex">
          <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out">
            <TransitionChild>
              <div className="absolute top-0 left-full flex w-16 justify-center pt-5">
                <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                  <span className="sr-only">{t('sidebar.closeSidebar')}</span>
                  <XMarkIcon className="size-6 text-white" />
                </button>
              </div>
            </TransitionChild>

            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-base-200 px-6 pb-2 ring-1 ring-base-content/10">
              <div className="flex h-16 shrink-0 items-center">
                <img
                  alt="Budgenix"
                  src={BudgenixLogo}
                  className="h-8 w-auto"
                />
              </div>

              <nav className="flex flex-1 flex-col">
                {sidebarNav.map((section) => (
                  <div key={section.section} className="mb-4">
                    <p className="text-xs text-base-content/60 font-semibold uppercase mb-2">
                      {t(section.section)}
                    </p>
                    <ul className="-mx-2 space-y-1">
                      {section.items.map((item) => (
                        <li key={item.label}>
                          <a
                            href={item.path}
                            className={classNames(
                              'group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold',
                              'text-base-content/70 hover:bg-neutral hover:text-neutral-content'
                            )}
                          >
                            <item.icon className="size-5 shrink-0" aria-hidden="true" />
                            {t(item.label)}
                          </a>
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
      <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-base-200 px-6">
        <div className="flex items-center gap-x-3 h-14 px-2">
          <img src={BudgenixLogo} alt="Budgenix Logo" className="h-8 w-auto" />
          <span className="logo-font font-bold text-lg text-base-content">Budgenix</span>
        </div>
        <div className="h-2 w-full rounded-full mb-4">
          <GradientSeparator direction="horizontal" />
        </div>

        <nav className="flex-1 flex flex-col justify-start">
          {sidebarNav.map((section) => (
            <div key={section.section} className="mb-6">
              <p className="text-xs text-base-content/60 font-semibold uppercase mb-2">
                {t(section.section)}
              </p>
              <ul className="-mx-2 space-y-1">
                {section.items.map((item) => (
                  <li key={item.label}>
                    {item.action === 'logout' ? (
                    <button
                      onClick={logout}
                      className={classNames(
                        'cursor-pointer group flex w-full items-center gap-x-3 rounded-md p-2 text-sm font-semibold',
                        'text-base-content/70 hover:bg-neutral hover:text-neutral-content'
                      )}
                    >
                      <item.icon className="size-5 shrink-0" />
                      {t(item.label)}
                    </button>
                  ) : (
                    <a
                      href={item.path}
                      className={classNames(
                        'group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold',
                        'text-base-content/70 hover:bg-neutral hover:text-neutral-content'
                      )}
                    >
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

        {/* Bottom profile section */}
        <div className="mt-auto border-t border-base-content/10 pt-4 mb-4">
          <div className="flex items-center gap-x-3">
            <img
              alt="User avatar"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="text-sm font-semibold text-base-content">
                {t('sidebar.profile')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Topbar Toggle */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center bg-base-100 px-4 py-4 shadow sm:px-6 lg:hidden">
        <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-base-content/70">
          <span className="sr-only">{t('sidebar.openSidebar')}</span>
          <Bars3Icon className="size-6" aria-hidden="true" />
        </button>
      </div>
    </>
  )
}
