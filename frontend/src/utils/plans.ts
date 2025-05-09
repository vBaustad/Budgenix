// utils/plans.ts (or keep it in the page file for now)

export const tiers = [
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
    price: { monthly: '$7', annually: '$60' },
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
    price: { monthly: '$14', annually: '$150' },
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
    price: { monthly: '$24', annually: '$220' },
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
  