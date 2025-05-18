export const tiers = [
  {
    id: 'free',
    href: '/signup',
    price: { monthly: '$0', annually: '$0' },
    mostPopular: false,
    features: ['trackExpenses', 'simpleBudgets', 'basicReports'],
  },
  {
    id: 'hobby',
    href: '/signup?plan=hobby',
    price: { monthly: '$7', annually: '$60' },
    mostPopular: false,
    features: ['recurringExpenses', 'categoryGrouping', 'exportCSV', 'emailSupport'],
  },
  {
    id: 'pro',
    href: '/signup?plan=pro',
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
    href: '/signup?plan=proplus',
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
