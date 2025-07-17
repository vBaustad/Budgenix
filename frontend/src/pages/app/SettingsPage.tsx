import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import CurrencyDropdown from '@/components/common/CurrencyDropdown';
import { ThemeDropdown } from '@/components/common/ThemeDropdown';
import InputField from '@/components/common/forms/InputField';
import { useUser } from '@/context/UserContext';
import { apiFetch } from '@/utils/api';

export default function SettingsPage() {
  const { t } = useTranslation();
  const { user, isLoading } = useUser();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    stateOrProvince: '',
    zipOrPostalCode: '',
    country: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        addressLine1: user.addressLine1 || '',
        addressLine2: user.addressLine2 || '',
        city: user.city || '',
        stateOrProvince: user.stateOrProvince || '',
        zipOrPostalCode: user.zipOrPostalCode || '',
        country: user.country || '',
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/api/account/me', {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      toast.success(t('settings.messages.profileSuccess'));
    } catch (err) {
      console.error('[SettingsPage] Failed to update profile', err);
      toast.error(t('settings.messages.profileFail'));
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error(t('settings.password.errorMismatch'));
      return;
    }
    try {
      await apiFetch('/api/account/me/password', {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });
      toast.success(t('settings.messages.passwordSuccess'));
    } catch (err) {
      console.error('[SettingsPage] Failed to update password', err);
      toast.error(t('settings.messages.passwordFail'));
    }
  };

  if (isLoading) {
    return <div className="p-8">{t('shared.loading')}</div>;
  }

  return (
    <div className="bg-base-100 text-base-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <h1 className="text-2xl font-bold">{t('settings.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6 lg:col-span-2">
          <div className="card bg-base-200 p-6 shadow">
            <h2 className="text-lg font-semibold mb-2">{t('settings.profile.title')}</h2>
            <p className="text-sm text-base-content/70 mb-4">
              {t('settings.profile.description')}
            </p>
            <div className="space-y-2 text-sm">
              <p><strong>{t('settings.profile.fields.name')}</strong> {user?.firstName} {user?.lastName}</p>
              <p><strong>{t('settings.profile.fields.email')}</strong> {user?.email}</p>
              <p><strong>{t('settings.profile.fields.username')}</strong> {user?.userName}</p>
              <p>
                <strong>{t('settings.profile.fields.address')}</strong> {user?.addressLine1}, {user?.addressLine2} {user?.city} {user?.stateOrProvince} {user?.zipOrPostalCode}, {user?.country}
              </p>
              <p><strong>{t('settings.profile.fields.tier')}</strong> {user?.subscriptionTier}</p>
              <p><strong>{t('settings.profile.fields.billingCycle')}</strong> {user?.billingCycle}</p>
              <p><strong>{t('settings.profile.fields.nextPayment')}</strong> {user?.subscriptionEndDate || 'N/A'}</p>
            </div>
          </div>

          <div className="card bg-base-200 p-6 shadow space-y-4">
            <h2 className="text-lg font-semibold">{t('settings.updateProfile.title')}</h2>
            <form onSubmit={handleUserSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField name="firstName" placeholder={t('register.fields.firstName')} value={formData.firstName} onChange={handleChange} />
              <InputField name="lastName" placeholder={t('register.fields.lastName')} value={formData.lastName} onChange={handleChange} />
              <InputField name="addressLine1" placeholder={t('register.fields.address')} value={formData.addressLine1} onChange={handleChange} />
              <InputField name="addressLine2" placeholder="Address line 2" value={formData.addressLine2} onChange={handleChange} />
              <InputField name="city" placeholder={t('register.fields.city', 'City')} value={formData.city} onChange={handleChange} />
              <InputField name="stateOrProvince" placeholder={t('register.fields.stateOrProvince', 'State/Province')} value={formData.stateOrProvince} onChange={handleChange} />
              <InputField name="zipOrPostalCode" placeholder={t('register.fields.zipOrPostalCode', 'ZIP/Postal Code')} value={formData.zipOrPostalCode} onChange={handleChange} />
              <InputField name="country" placeholder={t('register.fields.country')} value={formData.country} onChange={handleChange} />
              <div className="col-span-full">
                <button type="submit" className="btn btn-primary">{t('settings.updateProfile.save')}</button>
              </div>
            </form>
          </div>

          <div className="card bg-base-200 p-6 shadow space-y-4">
            <h2 className="text-lg font-semibold">{t('settings.password.title')}</h2>
            <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField name="currentPassword" type="password" placeholder={t('login.password')} value={formData.currentPassword} onChange={handleChange} />
              <InputField name="newPassword" type="password" placeholder={t('register.fields.password')} value={formData.newPassword} onChange={handleChange} />
              <InputField name="confirmNewPassword" type="password" placeholder={t('register.fields.confirmPassword')} value={formData.confirmNewPassword} onChange={handleChange} />
              <div className="col-span-full">
                <button type="submit" className="btn btn-primary">{t('settings.password.update')}</button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card bg-base-200 p-6 shadow">
            <h2 className="text-lg font-semibold mb-2">{t('settings.app.title')}</h2>
            <p className="text-sm text-base-content/70 mb-4">{t('settings.app.description')}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">{t('settings.app.currency')}</label>
                <CurrencyDropdown />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">{t('settings.app.theme')}</label>
                <ThemeDropdown />
              </div>
              <hr className="border-base-300 my-4" />
              <div className="text-sm text-base-content/70">
                <p><strong>{t('settings.app.dateFormat')}:</strong> {t('shared.comingSoon')}</p>
                <p><strong>{t('settings.app.language')}:</strong> {t('shared.comingSoon')}</p>
                <p><strong>{t('settings.app.timeZone')}:</strong> {t('shared.comingSoon')}</p>
                <p><strong>{t('settings.app.notifications')}:</strong> {t('shared.comingSoon')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
