import { AppIcons } from '@/components/icons/AppIcons';
import type { SidebarSection } from '@/types/shared/sidebar';

export const sidebarNav: SidebarSection[] = [
  {
    section: '',
    items: [
      { label: 'sidebar.dashboard', path: '/dashboard', icon: AppIcons.dashboard },
      { label: 'sidebar.budgets', path: '/budgets', icon: AppIcons.wallet },
      { label: 'sidebar.expenses', path: '/expenses', icon: AppIcons.expenses },
      { label: 'sidebar.income', path: '/income', icon: AppIcons.income },
      { label: 'sidebar.cashflow', path: '/cashflow', icon: AppIcons.recurring }
    ],
  },
  {
    section: 'sidebar.planning',
    items: [
      { label: 'sidebar.goals', path: '/goals', icon: AppIcons.goal },
      { label: 'sidebar.vacation', path: '/vacation-mode', icon: AppIcons.calendar },
      { label: 'sidebar.reports', path: '/reports', icon: AppIcons.report },
    ],
  },
  {
    section: 'sidebar.system',
    items: [
      { label: 'sidebar.settings', path: '/settings', icon: AppIcons.user },      
      { label: 'sidebar.logout', action: 'logout', icon: AppIcons.logout },
    ]
  }
];
