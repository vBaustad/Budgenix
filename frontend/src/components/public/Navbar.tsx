'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import BudgenixLogo from '../../assets/Logo/BudgenixLogo.png';
import { ThemeDropdown } from '../common/ThemeDropdown';

const navigation = [
  { name: 'Home', href: '/#' },
  { name: 'Features', href: '/#about' },
  { name: 'Pricing', href: '/#pricing' },  
  { name: 'Sign Up', href: '/signup' },
]
export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 20) // Adjust the 20 if needed
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
          <div className="flex lg:flex-1">
            <a href="#">
            <img src={BudgenixLogo} alt="Budgenix" className="max-h-12 w-auto" />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-base-content/70"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a 
                key={item.name} 
                href={item.href}
                className="text-sm/6 font-semibold text-base-content hover:text-primary">
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <ThemeDropdown />
            <a href="/login" className="text-sm/6 font-semibold text-base-content hover:text-primary">
              Log in <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-base-100 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-base-content/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
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
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-base-content/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-base-content hover:bg-base-200"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-base-content hover:bg-base-200"
                  >
                    Log in
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

