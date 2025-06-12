import CurrencyDropdown from '@/components/common/CurrencyDropdown';
import { ThemeDropdown } from '@/components/common/ThemeDropdown';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// import { ThemeSettings } from './ThemeSettings'; // placeholder for actual components
// import { CurrencySettings } from './CurrencySettings'; // placeholder
// import { ChangePassword } from './ChangePassword'; // placeholder

const settingsSections = [
  { key: 'user', label: 'User Settings' },
  { key: 'app', label: 'App Settings' },
];

export default function SettingsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('user');

  return (
    <div className="flex min-h-screen bg-base-100 text-base-content">
      {/* Sidebar Navigation */}
      <aside className="w-56 border-r border-base-300 px-4 py-6 space-y-3">
        {settingsSections.map((section) => (
          <button
            key={section.key}
            className={`w-full text-left px-3 py-2 rounded-md transition font-medium ${
              activeTab === section.key
                ? 'bg-base-300 text-base-content'
                : 'text-base-content/70 hover:bg-base-200'
            }`}
            onClick={() => setActiveTab(section.key)}
          >
            {t(`settings.${section.key}`) || section.label}
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <section className="flex-1 px-8 py-6 space-y-8">
        {activeTab === 'user' && (
          <>
            {/* 👤 User Settings Section */}
            <h2 className="text-xl font-bold">{t('settings.user')}</h2>
            {/* <ChangePassword /> */}
            {/* Add other user-related settings here */}
          </>
        )}

        {activeTab === 'app' && (
          <>
            {/* ⚙️ App Settings Section */}
            <h2 className="text-xl font-bold">{t('settings.app')}</h2>
            <CurrencyDropdown />
            <ThemeDropdown />
            {/* Add other app-related settings here */}
          </>
        )}
      </section>
    </div>
  );
}
