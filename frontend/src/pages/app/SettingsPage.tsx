import { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import CurrencyDropdown from '@/components/common/CurrencyDropdown';
import { ThemeDropdown } from '@/components/common/ThemeDropdown';
import InputField from '@/components/common/forms/InputField';
import { useUser } from '@/context/UserContext';
import { apiFetch } from '@/utils/api';

export default function SettingsPage() {
  // const location = useLocation();
  // const activeTab = location.hash.replace('#', '') || 'user';
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
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('[SettingsPage] Failed to update profile', err);
      toast.error('Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error('Passwords do not match');
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
      toast.success('Password updated!');
    } catch (err) {
      console.error('[SettingsPage] Failed to update password', err);
      toast.error('Failed to update password');
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading user settings...</div>;
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User + Account section */}
        <div className="space-y-6 lg:col-span-2">
          <div className="card bg-base-200 p-6 shadow">
            <h2 className="text-lg font-semibold mb-2">Profile</h2>
            <p className="text-sm text-base-content/70 mb-4">
              Review your personal details and subscription.
            </p>
            <div className="space-y-2">
              <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Username:</strong> {user?.userName}</p>
              <p><strong>Address:</strong> {user?.addressLine1}, {user?.addressLine2} {user?.city} {user?.stateOrProvince} {user?.zipOrPostalCode}, {user?.country}</p>
              <p><strong>Tier:</strong> {user?.subscriptionTier}</p>
              <p><strong>Billing cycle:</strong> {user?.billingCycle}</p>
              <p><strong>Next payment:</strong> {user?.subscriptionEndDate || 'N/A'}</p>
            </div>
          </div>

          <div className="card bg-base-200 p-6 shadow space-y-4">
            <h2 className="text-lg font-semibold">Update Profile</h2>
            <form onSubmit={handleUserSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} />
              <InputField name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} />
              <InputField name="addressLine1" placeholder="Address line 1" value={formData.addressLine1} onChange={handleChange} />
              <InputField name="addressLine2" placeholder="Address line 2" value={formData.addressLine2} onChange={handleChange} />
              <InputField name="city" placeholder="City" value={formData.city} onChange={handleChange} />
              <InputField name="stateOrProvince" placeholder="State/Province" value={formData.stateOrProvince} onChange={handleChange} />
              <InputField name="zipOrPostalCode" placeholder="ZIP/Postal Code" value={formData.zipOrPostalCode} onChange={handleChange} />
              <InputField name="country" placeholder="Country" value={formData.country} onChange={handleChange} />
              <div className="col-span-full">
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>

          <div className="card bg-base-200 p-6 shadow space-y-4">
            <h2 className="text-lg font-semibold">Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField name="currentPassword" type="password" placeholder="Current password" value={formData.currentPassword} onChange={handleChange} />
              <InputField name="newPassword" type="password" placeholder="New password" value={formData.newPassword} onChange={handleChange} />
              <InputField name="confirmNewPassword" type="password" placeholder="Confirm new password" value={formData.confirmNewPassword} onChange={handleChange} />
              <div className="col-span-full">
                <button type="submit" className="btn btn-primary">Update Password</button>
              </div>
            </form>
          </div>
        </div>

        {/* App settings section */}
        <div className="space-y-6">
          <div className="card bg-base-200 p-6 shadow">
            <h2 className="text-lg font-semibold mb-2">App Settings</h2>
            <p className="text-sm text-base-content/70 mb-4">Configure your app preferences.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Currency</label>
                <CurrencyDropdown />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Theme</label>
                <ThemeDropdown />
              </div>
              <hr className="border-base-300 my-4" />
              <div className="text-sm text-base-content/70">
                <p><strong>Date Format:</strong> Coming soon...</p>
                <p><strong>Language:</strong> Coming soon...</p>
                <p><strong>Time Zone:</strong> Coming soon...</p>
                <p><strong>Notifications:</strong> Coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
