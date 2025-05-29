// import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { ThemeDropdown } from '../common/ThemeDropdown';
import { useLocation } from 'react-router-dom';
import CurrencyDropdown from '../common/CurrencyDropdown';

const routeTitles: Record<string, string> = {
    '/dashboard': 'topbar.dashboard',
    '/budgets': 'topbar.budgets',
    '/expenses': 'topbar.expenses',
    '/income': 'topbar.income',
    '/goals': 'topbar.goals',
    '/vacation-mode': 'topbar.vacation',
    '/reports': 'topbar.reports',
    '/settings': 'topbar.settings',
  }

  export default function Topbar() {
    const { pathname } = useLocation()
    const { t } = useTranslation()  
    const titleKey = routeTitles[pathname] || ''
    const title = t(titleKey)
    

return (
    <>
        <div className="h-14 flex justify-between bg-base-100">
            <h1 className="text-xl items-center p-4 font-bold">{title}</h1>
            <div className="flex items-center justify-end gap-6 text-sm font-medium text-base-content">
            <CurrencyDropdown />
            <ThemeDropdown />
            </div>
        </div>            
    </>
    );
}
