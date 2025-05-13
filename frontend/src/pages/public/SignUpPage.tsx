'use client'

import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { tiers } from '../../constants/plans'
import { Radio, RadioGroup } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import RegistrationForm from '../../components/public/RegistrationForm'
import { useTranslation } from 'react-i18next'

function classNames(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

type FrequencyValue = 'monthly' | 'annually'

const frequencies: { value: FrequencyValue; label: string; priceSuffix: string }[] = [
  { value: 'monthly', label: 'pricing.monthly', priceSuffix: '/month' },
  { value: 'annually', label: 'pricing.annually', priceSuffix: '/year' }
]

export default function SignUpPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const planId = searchParams.get('plan') || 'free'
  const selectedPlan = tiers.find((tier) => tier.id === planId) || tiers[0]
  const navigate = useNavigate()
  const [frequency, setFrequency] = useState(frequencies[0])

  return (
    <div className="bg-base-100 min-h-screen flex flex-col justify-center items-center px-4 py-12 pt-24">
      <section className="max-w-6xl w-full mx-auto py-16 px-4 text-center">
        <h2 className="text-4xl font-bold text-base-content mb-4">
          {t('signup.title')}
        </h2>
        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
          {t('signup.subtitle')}
        </p>

        <div className="mt-16 flex justify-center">
          <fieldset aria-label={t('signup.paymentFrequency')}>
            <RadioGroup
              value={frequency}
              onChange={setFrequency}
              className="grid grid-cols-2 gap-x-1 rounded-full bg-base-200 p-1 text-center text-xs/5 font-semibold text-base-content"
            >
              {frequencies.map((option) => (
                <Radio
                  key={option.value}
                  value={option}
                  className={({ checked }) =>
                    classNames(
                      checked ? 'bg-primary text-primary-content' : 'text-base-content',
                      'cursor-pointer rounded-full px-2.5 py-1 transition'
                    )
                  }
                >
                  {t(option.label)}
                </Radio>
              ))}
            </RadioGroup>
          </fieldset>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 w-full max-w-6xl mx-auto pt-24">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              onClick={() => {
                navigate(`/signup?plan=${tier.id}`)
              }}
              className={`
                cursor-pointer card shadow-2xl
                ${selectedPlan.id === tier.id
                  ? 'ring-2 ring-primary'
                  : 'border border-base-content/20 hover:border-base-content hover:bg-base-200 transition'}
              `}
            >
              <div className="card-body flex flex-col justify-start">
                <div>
                  <h3 className="card-title text-base-content flex justify-between items-center">
                    {t(`pricing.tiers.${tier.id}.name`)}
                    {selectedPlan.id === tier.id && (
                      <span className="badge badge-primary">{t('signup.selected')}</span>
                    )}
                  </h3>
                  <p className="text-base-content/70 mt-2">
                    {t(`pricing.tiers.${tier.id}.description`)}
                  </p>
                  <p className="text-3xl font-bold text-base-content mt-3">
                    {tier.price[frequency.value]}
                    <span className="text-sm text-base-content/60"> {frequency.priceSuffix}</span>
                  </p>
                  <ul className="list-none text-base-content/60 space-y-2 mt-4">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-top space-x-1">
                        <CheckIcon aria-hidden="true" className="h-5 w-5 flex-none text-primary/80" />
                        {t(`pricing.tiers.${tier.id}.features.${feature}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Signup Form */}
      <div className="bg-base-100 flex flex-col justify-center items-center px-4 py-12">
        <div className="card bg-base-200 border border-base-content/20 shadow-xl w-full max-w-4xl min-w-[60rem] grid grid-cols-1 md:grid-cols-2 overflow-hidden">
          {/* Left: Plan info */}
          <div className="p-8 bg-primary text-primary-content flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-2">
              {t(`pricing.tiers.${selectedPlan.id}.name`)} {t('signup.plan')}
            </h2>
            <p className="text-primary-content/80 mb-4">
              {t(`pricing.tiers.${selectedPlan.id}.description`)}
            </p>
            <p className="text-4xl font-bold mb-6">
              {selectedPlan.price[frequency.value] === '$0'
                ? t('pricing.tiers.free.name')
                : `${selectedPlan.price[frequency.value]} ${frequency.priceSuffix}`}
            </p>
            <ul className="list-disc list-inside space-y-2 text-primary-content/80">
              {selectedPlan.features.map((feature) => (
                <li key={feature}>
                  {t(`pricing.tiers.${selectedPlan.id}.features.${feature}`)}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Form */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-base-content mb-6">
              {t('signup.formTitle')}
            </h2>
            <RegistrationForm selectedPlan={selectedPlan} frequency={frequency} />
            <p className="mt-6 text-center text-base-content/70 text-sm">
              {t('signup.alreadyHaveAccount')}{' '}
              <a href="/login" className="text-primary hover:underline">
                {t('signup.loginLink')}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
