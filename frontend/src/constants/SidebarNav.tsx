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
  } from '@heroicons/react/24/outline'
  
  export const sidebarNav = [
    {
      section: 'sidebar.main',
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
        { label: 'sidebar.settings', path: '/settings', icon: Cog6ToothIcon },
        { label: 'sidebar.logout', action: 'logout', icon: ArrowRightStartOnRectangleIcon },
      ],
    },
  ]
  