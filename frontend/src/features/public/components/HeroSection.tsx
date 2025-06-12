'use client'

import { useTranslation } from 'react-i18next';

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <div className="relative isolate pt-14">                
      <div className="py-24 sm:py-32 lg:pb-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-base-content sm:text-7xl">
              {t('hero.title')}
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-base-content/70 sm:text-xl/8">
              {t('hero.description')}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a href="#pricing" className="btn btn-primary">
                {t('hero.getStarted')}
              </a>
              <a href="#about" className="link text-sm">
                {t('hero.learnMore')} <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>                
          <img
            alt="App screenshot"
            src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
            width={2432}
            height={1442}
            className="mt-16 rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10 sm:mt-24"
          />
        </div>
      </div>
    </div>      
  )
}
