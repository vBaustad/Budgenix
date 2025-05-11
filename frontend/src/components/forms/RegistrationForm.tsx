import { useState, useEffect } from 'react';
import { tiers } from '../../utils/plans';
import InputField from './InputField';
import PaymentSelector from './PaymentSelector';
import { PasswordIcon, UserIcon, EmailIcon } from './icons/InputIcons';
import { countryOptions } from '../../utils/countries';
import SelectField from './SelectField';
import { useTranslation } from 'react-i18next';

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert(t('register.errors.passwordMismatch'));
      return;
    }

    if (isPaidPlan && !formData.addressLine1) {
      alert(t('register.errors.addressRequired'));
      return;
    }

    if (isPaidPlan && !formData.paymentMethod) {
      alert(t('register.errors.paymentRequired'));
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...payload } = {
        ...formData,
        subscriptionTier: formData.subscriptionTier,
        billingCycle: frequency.value === 'monthly' ? 'Monthly' : 'Annually'
      };

      const response = await fetch('/api/account/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || t('register.errors.generic'));
        return;
      }

      alert(t('register.success'));
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Network error:', err);
      alert(t('register.errors.network'));
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
          required
          icon={UserIcon}
        />
        <div className="grid grid-cols-2 gap-4">
          <InputField
            placeholder={t('register.fields.firstName')}
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            required
            icon={UserIcon}
          />
          <InputField
            placeholder={t('register.fields.lastName')}
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            required
            icon={UserIcon}
          />
        </div>
        <InputField
          placeholder={t('register.fields.email')}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          icon={EmailIcon}
        />
        <div className="grid grid-cols-2 gap-4">
          <InputField
            placeholder={t('register.fields.password')}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            icon={PasswordIcon}
          />
          <InputField
            placeholder={t('register.fields.confirmPassword')}
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            icon={PasswordIcon}
          />
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
              required
              icon={UserIcon}
            />
            <SelectField
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              options={countryOptions}
              placeholder={t('register.fields.country')}
            />
          </div>

          <div className="mt-6">
            <p className="text-base-content/70 mb-2">{t('register.paymentMethodLabel')}</p>
            <PaymentSelector
              selected={formData.paymentMethod}
              onSelect={(method) => setFormData((prev) => ({ ...prev, paymentMethod: method }))}
            />
            {formData.paymentMethod === 'paypal' && (
              <div className="mt-4">
                <div id="paypal-button-container"></div>
              </div>
            )}
            {formData.paymentMethod === 'stripe' && (
              <div className="mt-4 bg-base-300 p-4 rounded">
                <p className="text-base-content/70 text-center">{t('register.stripePlaceholder')}</p>
              </div>
            )}
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
