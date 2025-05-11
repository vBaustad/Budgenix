'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Radio, RadioGroup } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import { tiers } from '../../utils/plans'

type FrequencyValue = 'monthly' | 'annually'

const frequencies: { value: FrequencyValue; label: string; priceSuffix: string }[] = [
  { value: 'monthly', label: 'pricing.monthly', priceSuffix: '/month' },
  { value: 'annually', label: 'pricing.annually', priceSuffix: '/year' }
]

function classNames(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function PricingSection() {
  const { t } = useTranslation()
  const [frequency, setFrequency] = useState(frequencies[0])

  return (
    <div id="pricing" className="bg-base-100 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mt-2 text-5xl font-semibold tracking-tight text-balance text-base-content sm:text-6xl">
            {t('pricing.title')}
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-pretty text-base-content/70 sm:text-xl/8">
          {t('pricing.description')}
        </p>

        <div className="mt-16 flex justify-center relative z-10">
          <fieldset aria-label="Payment frequency">
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

        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={classNames(
                tier.mostPopular ? 'ring-2 ring-primary' : 'border border-base-content/30',
                'rounded-3xl p-8 xl:p-10 shadow-xl'
              )}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3 id={tier.id} className="text-lg/8 font-semibold text-base-content">
                  {t(`pricing.tiers.${tier.id}.name`)}
                </h3>
                {tier.mostPopular && (
                  <p className="rounded-full bg-primary px-2.5 py-1 text-xs/5 font-semibold text-primary-content">
                    {t('pricing.mostPopular')}
                  </p>
                )}
              </div>

              <p className="mt-4 text-sm/6 text-base-content/70">
                {t(`pricing.tiers.${tier.id}.description`)}
              </p>

              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-semibold tracking-tight text-base-content">
                  {tier.price[frequency.value]}
                </span>
                <span className="text-sm/6 font-semibold text-base-content/70">
                  {frequency.priceSuffix}
                </span>
              </p>

              <a
                href={tier.href}
                aria-describedby={tier.id}
                className={classNames(
                  tier.mostPopular
                    ? 'bg-primary text-primary-content shadow-sm hover:bg-primary/70 hover:border-base-content/80 border border-primary focus-visible:outline-primary transition'
                    : 'bg-base-200 text-base-content hover:border-base-content/80 hover:bg-base-200 border border-base-content/10 focus-visible:outline-base-content transition',
                  'mt-6 block rounded-md px-3 py-2 text-center text-sm/6 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2'
                )}
              >
                {t('pricing.buyButton')}
              </a>

              <ul role="list" className="mt-8 space-y-3 text-sm/6 text-base-content/70 xl:mt-10">
                {tier.features.map((featureKey) => (
                  <li key={featureKey} className="flex gap-x-3">
                    <CheckIcon aria-hidden="true" className="h-5 w-5 flex-none text-primary/80" />
                    {t(`pricing.tiers.${tier.id}.features.${featureKey}`)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
