import { useState, useEffect } from 'react';
import CurrencyDropdown from '@/components/common/CurrencyDropdown';
import { ThemeDropdown } from '@/components/common/ThemeDropdown';
import { useLocation } from 'react-router-dom';
import InputField from '@/components/common/forms/InputField';
import { toast } from 'react-hot-toast';
import { useUser } from '@/context/UserContext';
import { apiFetch } from '@/utils/api';

export default function SettingsPage() {
  // const { t } = useTranslation();
  const location = useLocation();
  const activeTab = location.hash.replace('#', '') || 'user';

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

  // Sync form data when user loads
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
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
    <div className="min-h-screen bg-base-100 text-base-content px-8 py-6 space-y-8">
      {activeTab === 'user' && user && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Overview */}
          <div className="col-span-1 space-y-4">
            <div className="card bg-base-200 p-4 shadow">
              <h3 className="text-lg font-semibold mb-2">Profile</h3>
              <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Username:</strong> {user.userName}</p>
            </div>

            <div className="card bg-base-200 p-4 shadow">
              <h3 className="text-lg font-semibold mb-2">Address</h3>
              <p>{user.addressLine1}</p>
              {user.addressLine2 && <p>{user.addressLine2}</p>}
              <p>{user.city}, {user.stateOrProvince} {user.zipOrPostalCode}</p>
              <p>{user.country}</p>
            </div>

            <div className="card bg-base-200 p-4 shadow">
              <h3 className="text-lg font-semibold mb-2">Subscription</h3>
              <p><strong>Tier:</strong> {user.subscriptionTier}</p>
              <p><strong>Billing cycle:</strong> {user.billingCycle}</p>
              <p><strong>Next payment:</strong> {user.subscriptionEndDate || 'N/A'}</p>
              {user.subscriptionIsActive && (
                <button className="btn btn-sm btn-error mt-2">Cancel Subscription</button>
              )}
            </div>
          </div>

          {/* Right: Forms */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <form onSubmit={handleUserSubmit} className="card bg-base-200 p-4 shadow space-y-4">
              <h3 className="text-lg font-semibold mb-2">Update Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} />
                <InputField name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} />
                <InputField name="addressLine1" placeholder="Address line 1" value={formData.addressLine1} onChange={handleChange} />
                <InputField name="addressLine2" placeholder="Address line 2" value={formData.addressLine2} onChange={handleChange} />
                <InputField name="city" placeholder="City" value={formData.city} onChange={handleChange} />
                <InputField name="stateOrProvince" placeholder="State/Province" value={formData.stateOrProvince} onChange={handleChange} />
                <InputField name="zipOrPostalCode" placeholder="ZIP/Postal Code" value={formData.zipOrPostalCode} onChange={handleChange} />
                <InputField name="country" placeholder="Country" value={formData.country} onChange={handleChange} />
              </div>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>

            <form onSubmit={handlePasswordSubmit} className="card bg-base-200 p-4 shadow space-y-4">
              <h3 className="text-lg font-semibold mb-2">Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField name="currentPassword" type="password" placeholder="Current password" value={formData.currentPassword} onChange={handleChange} />
                <InputField name="newPassword" type="password" placeholder="New password" value={formData.newPassword} onChange={handleChange} />
                <InputField name="confirmNewPassword" type="password" placeholder="Confirm new password" value={formData.confirmNewPassword} onChange={handleChange} />
              </div>
              <button type="submit" className="btn btn-primary">Update Password</button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'app' && (
        <div className="card bg-base-200 p-4 shadow">
          <h3 className="text-lg font-semibold mb-2">App Settings</h3>
          <CurrencyDropdown />
          <ThemeDropdown />
        </div>
      )}
    </div>
  );
}
