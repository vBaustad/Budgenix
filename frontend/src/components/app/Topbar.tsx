// import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { ThemeDropdown } from '../common/ThemeDropdown';

export default function Topbar() {
    const { t } = useTranslation();
    // const { logout } = useAuth();

    return (
        <>
            <div className="h-14 flex shadow items-center justify-between px-6 bg-base-100">
                <h1 className="text-xl font-bold">{t('topbar.dashboardTitle')}</h1>
                <ThemeDropdown />  
            </div>            
        </>
    );
}
