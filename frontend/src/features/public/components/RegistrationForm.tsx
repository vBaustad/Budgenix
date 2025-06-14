import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { tiers } from '@/constants/plans';
import InputField from '@/components/common/forms/InputField';
import PaymentSelector from './PaymentSelector';
import SelectField from '@/components/common/forms/SelectField';
import { countryOptions } from '@/constants/countries';
import { apiFetch } from '@/utils/api';

export type SubscriptionType = typeof tiers[number]['id'];

type RegistrationFormProps = {
  selectedPlan: typeof tiers[number];
  frequency: { value: 'monthly' | 'annually'; priceSuffix: string };
};

type RegistrationFormData = {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateOrProvince: string;
  zipOrPostalCode: string;
  country: string;
  paymentMethod?: 'paypal' | 'stripe';
  subscriptionTier: SubscriptionType;
  billingCycle: string;
};

export default function RegistrationForm({ selectedPlan, frequency }: RegistrationFormProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegistrationFormData>({
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    stateOrProvince: '',
    zipOrPostalCode: '',
    country: '',
    paymentMethod: undefined,
    subscriptionTier: selectedPlan.id,
    billingCycle: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const isPaidPlan = selectedPlan.price[frequency.value] !== '$0';

  useEffect(() => {
    if (isPaidPlan && formData.paymentMethod === 'paypal') {
      const existingScript = document.querySelector('script[src^="https://www.paypal.com/sdk/js"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&vault=true&intent=subscription`;
        script.async = true;
        document.body.appendChild(script);
        return () => {
          document.body.removeChild(script);
        };
      }
    }
  }, [isPaidPlan, formData.paymentMethod]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // clear error on change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fieldErrors: Record<string, string> = {};

    if (!formData.userName) fieldErrors.userName = 'Username is required';
    if (!formData.firstName) fieldErrors.firstName = 'First name is required';
    if (!formData.lastName) fieldErrors.lastName = 'Last name is required';
    if (!formData.email) fieldErrors.email = 'Email is required';
    if (!formData.password) fieldErrors.password = 'Password is required';
    if (formData.password.length < 6) fieldErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) fieldErrors.confirmPassword = 'Passwords do not match';

    if (isPaidPlan) {
      if (!formData.addressLine1) fieldErrors.addressLine1 = 'Address is required for paid plans';
      if (!formData.paymentMethod) fieldErrors.paymentMethod = 'Select a payment method';
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...payload } = {
        ...formData,
        billingCycle: frequency.value === 'monthly' ? 'Monthly' : 'Annually'
      };

      await apiFetch('/api/account/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      // Could replace this with toast notification
      alert(t('register.successEmailSent'));
      navigate('/login');
    } catch (err) {
      console.error('Registration failed:', err);
      alert(err instanceof Error ? err.message : t('register.errors.generic'));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4">
        <InputField
          placeholder={t('register.fields.username')}
          name="userName"
          type="text"
          value={formData.userName}
          onChange={handleChange}
        />
        {errors.userName && <p className="text-error text-xs">{errors.userName}</p>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <InputField
              placeholder={t('register.fields.firstName')}
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && <p className="text-error text-xs">{errors.firstName}</p>}
          </div>
          <div>
            <InputField
              placeholder={t('register.fields.lastName')}
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && <p className="text-error text-xs">{errors.lastName}</p>}
          </div>
        </div>

        <InputField
          placeholder={t('register.fields.email')}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="text-error text-xs">{errors.email}</p>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <InputField
              placeholder={t('register.fields.password')}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="text-error text-xs">{errors.password}</p>}
          </div>
          <div>
            <InputField
              placeholder={t('register.fields.confirmPassword')}
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <p className="text-error text-xs">{errors.confirmPassword}</p>}
          </div>
        </div>
      </div>

      {isPaidPlan && (
        <>
          <div className="grid grid-cols-1 gap-4 mt-4">
            <InputField
              placeholder={t('register.fields.address')}
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
            />
            {errors.addressLine1 && <p className="text-error text-xs">{errors.addressLine1}</p>}

            <SelectField
              name="country"
              value={formData.country}
              onChange={handleChange}
              options={countryOptions}
              placeholder={t('register.fields.country')}
            />
            {errors.country && <p className="text-error text-xs">{errors.country}</p>}
          </div>

          <div className="mt-6">
            <p className="text-base-content/70 mb-2">{t('register.paymentMethodLabel')}</p>
            <PaymentSelector
              selected={formData.paymentMethod}
              onSelect={(method) => setFormData((prev) => ({ ...prev, paymentMethod: method }))}
            />
            {errors.paymentMethod && <p className="text-error text-xs">{errors.paymentMethod}</p>}
          </div>
        </>
      )}

      <button type="submit" className="btn btn-primary w-full mt-6">
        {selectedPlan.price[frequency.value] === '$0'
          ? t('register.submitFree')
          : t('register.submitPaid')}
      </button>
    </form>
  );
}
