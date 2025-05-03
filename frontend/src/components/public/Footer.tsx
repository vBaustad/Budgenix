import React from 'react';

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <div className="relative bg-gray-900">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 h-95 z-10 transform-gpu overflow-hidden blur-3xl"
    >
        <div
            style={{
                clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        />
    </div>
    <footer >
    
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 sm:pt-24 lg:px-8 lg:pt-32 text-center">
        <img
          alt="Budgenix"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
          className="mx-auto h-9"
        />
        <p className="mt-4 max-w-xl mx-auto text-sm text-gray-400">
          Budgenix helps you manage your personal finances with ease and clarity. Built for simplicity and control.
        </p>

        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-sm/6 text-gray-400">
            &copy; 2025 - {currentYear} Budgenix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
    </div>
  )
}
  