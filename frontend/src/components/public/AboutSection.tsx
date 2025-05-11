'use client'

import { useTranslation } from 'react-i18next';
import {
  AcademicCapIcon,
  CheckCircleIcon,
  HandRaisedIcon,
  RocketLaunchIcon,
  SparklesIcon,
  UserGroupIcon,
} from '@heroicons/react/20/solid';

const stats = [
  { key: 'founded', value: '2024' },
  { key: 'users', value: '10,000+' },
  { key: 'budgets', value: '25,000+' },
  { key: 'countries', value: '20+' },
];

const values = [
  { key: 'transparency', icon: RocketLaunchIcon },
  { key: 'empowerment', icon: HandRaisedIcon },
  { key: 'privacy', icon: UserGroupIcon },
  { key: 'improvement', icon: AcademicCapIcon },
  { key: 'collaboration', icon: SparklesIcon },
  { key: 'simplicity', icon: CheckCircleIcon },
];

export default function AboutSection() {
  const { t } = useTranslation();

  return (
    <div id="about" className="relative isolate bg-base-100">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-4 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
      >
        <div
          style={{
            clipPath:
              'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
          }}
          className="aspect-1108/632 w-[69.25rem] flex-none bg-linear-to-r from-[#80caff] to-[#4f46e5] opacity-25"
        />
      </div>

      <div className="px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl pt-24 text-center sm:pt-40">
          <h1 className="text-5xl font-semibold tracking-tight text-base-content sm:text-7xl">{t('about.title')}</h1>
          <p className="mt-8 text-lg font-medium text-pretty text-base-content/70 sm:text-xl/8">
            {t('about.description')}
          </p>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-8 text-base/7 text-base-content/80 lg:max-w-none lg:grid-cols-2">
            <div>
              <p>{t('about.paragraph1')}</p>
              <p className="mt-8">{t('about.paragraph2')}</p>
            </div>
            <div>
              <p>{t('about.paragraph3')}</p>
              <p className="mt-8">{t('about.paragraph4')}</p>
            </div>
          </div>

          <dl className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:mt-20 sm:grid-cols-2 sm:gap-y-16 lg:mt-28 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.key} className="flex flex-col-reverse gap-y-3 border-l border-base-content/10 pl-6">
                <dt className="text-base/7 text-base-content/70">{t(`about.stats.${stat.key}`)}</dt>
                <dd className="text-3xl font-semibold tracking-tight text-base-content">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-32 sm:mt-40 xl:mx-auto xl:max-w-7xl xl:px-8">
        <img
          alt=""
          src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2894&q=80"
          className="aspect-9/4 w-full object-cover xl:rounded-3xl"
        />
      </div>

      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-base-content sm:text-5xl">
            {t('about.missionTitle')}
          </h2>
          <p className="mt-6 text-lg/8 text-base-content/70">{t('about.missionDescription')}</p>
        </div>

        <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base/7 text-base-content/70 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-16">
          {values.map((value) => (
            <div key={value.key} className="relative pl-9">
              <dt className="inline font-semibold text-base-content">
                <value.icon aria-hidden="true" className="absolute top-1 left-1 size-5 text-primary" />
                {t(`about.values.${value.key}.title`)}
              </dt>{' '}
              <dd className="inline">{t(`about.values.${value.key}.desc`)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
