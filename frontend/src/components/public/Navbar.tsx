'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import BudgenixLogo from '../../assets/Logo/BudgenixLogo.png';
import { ThemeDropdown } from '../common/ThemeDropdown';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false);

  const navigation = [
    { key: 'home', href: '/#' },
    { key: 'features', href: '/#about' },
    { key: 'pricing', href: '/#pricing' },
    { key: 'signup', href: '/signup' }
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative">
      <header
        className={`
          fixed inset-x-0 top-0 z-50 transition-colors duration-300
          ${isScrolled ? 'bg-base-100 shadow-md' : 'bg-transparent'}
        `}
      >
        <nav aria-label="Global" className="flex items-center justify-between lg:pl-1 pr-6 lg:pr-8 h-16">
          <div className="flex lg:flex-1 items-center">
            <img src={BudgenixLogo} alt={t('navbar.brandAlt')} className="h-8 w-auto mr-1" />
            <div className="h-7 mr-2" style={{ width: '2px', background: 'linear-gradient(to bottom, #62c4a4, #207258)' }}></div>
            <span className="font-bold text-lg text-base-content">Budgenix</span>
          </div>

          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-base-content/70"
            >
              <span className="sr-only">{t('navbar.openMenu')}</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>

          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="text-sm/6 font-semibold text-base-content hover:text-primary"
              >
                {t(`navbar.${item.key}`)}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <ThemeDropdown />
            <a href="/login" className="text-sm/6 font-semibold text-base-content hover:text-primary">
              {t('navbar.login')} <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>

        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-base-100 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-base-content/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">{t('navbar.brandAlt')}</span>
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                  className="h-8 w-auto"
                />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-base-content/70"
              >
                <span className="sr-only">{t('navbar.closeMenu')}</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>

            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-base-content/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.key}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-base-content hover:bg-base-200"
                    >
                      {t(`navbar.${item.key}`)}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-base-content hover:bg-base-200"
                  >
                    {t('navbar.login')}
                  </a>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
    </div>
  )
}
