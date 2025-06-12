import {
    HomeIcon,
    WalletIcon,
    ReceiptPercentIcon,
    BanknotesIcon,
    FlagIcon,
    SunIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    ArrowRightStartOnRectangleIcon,
    AdjustmentsHorizontalIcon,
    UserIcon,
  } from '@heroicons/react/24/outline'
  
  import type { SidebarSection } from '@/types/shared/sidebar';


  export const sidebarNav: SidebarSection[] = [
    {
      section: '',
      items: [
        { label: 'sidebar.dashboard', path: '/dashboard', icon: HomeIcon },
        { label: 'sidebar.budgets', path: '/budgets', icon: WalletIcon },
        { label: 'sidebar.expenses', path: '/expenses', icon: ReceiptPercentIcon },
        { label: 'sidebar.income', path: '/income', icon: BanknotesIcon },
      ],
    },
    {
      section: 'sidebar.planning',
      items: [
        { label: 'sidebar.goals', path: '/goals', icon: FlagIcon },
        { label: 'sidebar.vacation', path: '/vacation-mode', icon: SunIcon },
        { label: 'sidebar.reports', path: '/reports', icon: ChartBarIcon },
      ],
    },
    {
      section: 'sidebar.system',
      items: [
        { label: 'sidebar.settings', icon: Cog6ToothIcon, collapsible: true, children: [
          { label: 'sidebar.settings.user', path: '/settings/user', icon: UserIcon },
          { label: 'sidebar.settings.app', path: '/settings/app', icon: AdjustmentsHorizontalIcon },
        ]},
        { label: 'sidebar.logout', action: 'logout', icon: ArrowRightStartOnRectangleIcon },
      ]
    }
  ]
  