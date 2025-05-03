'use client'

import { useState } from 'react'
import { Radio, RadioGroup } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'

type FrequencyValue = 'monthly' | 'annually';

const frequencies: { value: FrequencyValue; label: string; priceSuffix: string; }[] = [
  { value: 'monthly', label: 'Monthly', priceSuffix: '/month' },
  { value: 'annually', label: 'Annually', priceSuffix: '/year' },
];

  
  const tiers = [
    {
      name: 'Free',
      id: 'tier-free',
      href: '/register',
      price: { monthly: '$0', annually: '$0' },
      description: 'Basic budgeting features to get you started.',
      features: ['Track expenses', 'Simple budgets', 'Basic reports'],
      mostPopular: false,
    },
    {
      name: 'Hobby',
      id: 'tier-hobby',
      href: '/register?plan=hobby',
      price: { monthly: '$5', annually: '$50' },
      description: 'Extra tools for personal finance enthusiasts.',
      features: [
        'Recurring expenses',
        'Category grouping',
        'Export to CSV',
        'Email support',
      ],
      mostPopular: false,
    },
    {
      name: 'Pro',
      id: 'tier-pro',
      href: '/register?plan=pro',
      price: { monthly: '$15', annually: '$150' },
      description: 'Advanced tools for serious budgeters.',
      features: [
        'All Hobby features',
        'Advanced analytics',
        'Savings goals',
        'Multi-device sync',
        'Priority support',
      ],
      mostPopular: true,
    },
    {
      name: 'Pro+',
      id: 'tier-proplus',
      href: '/register?plan=proplus',
      price: { monthly: '$25', annually: '$250' },
      description: 'Full power, collaboration & VIP tools.',
      features: [
        'All Pro features',
        'Shared budgets (households)',
        'Goal tracking automation',
        'Investment tracking',
        'VIP support',
      ],
      mostPopular: false,
    },
  ];
  

function classNames(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function PricingSection() {
    const [frequency, setFrequency] = useState(frequencies[0]);
    return (
    <div id="pricing" className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
        <p className="mt-2 text-5xl font-semibold tracking-tight text-balance text-white sm:text-6xl">
            Simple, Transparent Pricing
        </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
            Budgenix offers flexible plans for every stage of your financial journey—from getting started to full financial mastery.
            Pick the plan that suits your needs and upgrade anytime.
        </p>
        <div className="mt-16 flex justify-center">
          <fieldset aria-label="Payment frequency">
            <RadioGroup
              value={frequency}
              onChange={setFrequency}
              className="grid grid-cols-2 gap-x-1 rounded-full bg-white/5 p-1 text-center text-xs/5 font-semibold text-white"
            >
              {frequencies.map((option) => (
                <Radio
                  key={option.value}
                  value={option}
                  className={({ checked }) =>
                    classNames(
                        checked ? 'bg-indigo-500 text-white' : 'text-white',
                        'cursor-pointer rounded-full px-2.5 py-1 transition'
                    )
                }
                >
                  {option.label}
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
                tier.mostPopular ? 'bg-white/5 ring-2 ring-indigo-500' : 'ring-1 ring-white/10',
                'rounded-3xl p-8 xl:p-10',
              )}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3 id={tier.id} className="text-lg/8 font-semibold text-white">
                  {tier.name}
                </h3>
                {tier.mostPopular ? (
                  <p className="rounded-full bg-indigo-500 px-2.5 py-1 text-xs/5 font-semibold text-white">
                    Most popular
                  </p>
                ) : null}
              </div>
              <p className="mt-4 text-sm/6 text-gray-300">{tier.description}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-semibold tracking-tight text-white">{tier.price[frequency.value]}</span>
                <span className="text-sm/6 font-semibold text-gray-300">{frequency.priceSuffix}</span>
              </p>
              <a
                href={tier.href}
                aria-describedby={tier.id}
                className={classNames(
                  tier.mostPopular
                    ? 'bg-indigo-500 text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-indigo-500'
                    : 'bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white',
                  'mt-6 block rounded-md px-3 py-2 text-center text-sm/6 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2',
                )}
              >
                Buy plan
              </a>
              <ul role="list" className="mt-8 space-y-3 text-sm/6 text-gray-300 xl:mt-10">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon aria-hidden="true" className="h-6 w-5 flex-none text-white" />
                    {feature}
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
