export const tiers = [
  {
    id: 'free',
    href: '/register',
    price: { monthly: '$0', annually: '$0' },
    mostPopular: false,
    features: ['trackExpenses', 'simpleBudgets', 'basicReports'],
  },
  {
    id: 'hobby',
    href: '/register?plan=hobby',
    price: { monthly: '$7', annually: '$60' },
    mostPopular: false,
    features: ['recurringExpenses', 'categoryGrouping', 'exportCSV', 'emailSupport'],
  },
  {
    id: 'pro',
    href: '/register?plan=pro',
    price: { monthly: '$14', annually: '$150' },
    mostPopular: true,
    features: [
      'allHobbyFeatures',
      'advancedAnalytics',
      'savingsGoals',
      'multiDeviceSync',
      'prioritySupport',
    ],
  },
  {
    id: 'proplus',
    href: '/register?plan=proplus',
    price: { monthly: '$24', annually: '$220' },
    mostPopular: false,
    features: [
      'allProFeatures',
      'sharedBudgets',
      'goalAutomation',
      'investmentTracking',
      'vipSupport',
    ],
  },
];
