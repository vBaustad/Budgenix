export const tiers = [
  {
    id: 'free',
    href: '/signup',
    price: { monthly: '$0', annually: '$0' },
    priceId: { monthly: null, annually: null },
    mostPopular: false,
    features: [
      'trackExpenses',
      'simpleBudgets',
      'basicReports',
      'emailReminders',
    ],
  },
  {
    id: 'hobby',
    href: '/signup?plan=hobby',
    price: { monthly: '$7', annually: '$60' },
    priceId: {
      monthly: 'price_1RZsC5IkjDJhyKR2lgxlIOxy',   // Hobby monthly
      annually: 'price_1RZsCOIkjDJhyKR2jAeS9b7F'   // Hobby yearly
    },
    mostPopular: false,
    features: [
      'allFreeFeatures',
      'recurringExpenses',
      'categoryGrouping',
      'exportCSV',
    ],
  },
  {
    id: 'pro',
    href: '/signup?plan=pro',
    price: { monthly: '$14', annually: '$150' },
    priceId: {
      monthly: 'price_1RZsBSIkjDJhyKR2pi0xLjpL',   // Pro monthly
      annually: 'price_1RZsBnIkjDJhyKR26j79crDK'   // Pro yearly
    },
    mostPopular: true,
    features: [
      'allHobbyFeatures',
      'advancedAnalytics',
      'savingsGoals',
      'multiDeviceSync',
    ],
  }
];
