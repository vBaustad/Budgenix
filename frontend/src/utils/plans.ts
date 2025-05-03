// utils/plans.ts (or keep it in the page file for now)

export const tiers = [
    {
      name: 'Free',
      id: 'free',
      price: { monthly: '$0', annually: '$0' },
      description: 'Basic budgeting features to get you started.',
      features: ['Track expenses', 'Simple budgets', 'Basic reports'],
    },
    {
      name: 'Hobby',
      id: 'hobby',
      price: { monthly: '$5', annually: '$50' },
      description: 'Extra tools for personal finance enthusiasts.',
      features: ['Recurring expenses', 'Category grouping', 'Export to CSV'],
    },
    {
      name: 'Pro',
      id: 'pro',
      price: { monthly: '$15', annually: '$150' },
      description: 'Advanced tools for serious budgeters.',
      features: ['All Hobby features', 'Advanced analytics', 'Savings goals'],
    },
    {
      name: 'Pro+',
      id: 'proplus',
      price: { monthly: '$25', annually: '$250' },
      description: 'Full power, collaboration & VIP tools.',
      features: ['All Pro features', 'Shared budgets (households)', 'VIP support'],
    },
  ];
  