import { useState, useEffect } from 'react';
import { tiers } from '../../utils/plans';  // Assuming you already have tiers imported
import InputField from './InputField';
import PaymentSelector from './PaymentSelector';
import { PasswordIcon, UserIcon, EmailIcon } from './icons/InputIcons';
import { countryOptions } from '../../utils/countries';
import SelectField from './SelectField';


// Define type from tiers
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
    billingCycle: string
};

export default function RegistrationForm({ selectedPlan,frequency }: RegistrationFormProps) {
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
      alert('Passwords do not match!');
      return;
    }

    if (isPaidPlan && !formData.addressLine1) {
      alert('Address is required for paid plans!');
      return;
    }

    if (isPaidPlan && !formData.paymentMethod) {
      alert('Please select a payment method!');
      return;
    }

    try {
        

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, ...payload } = {
            ...formData,
            subscriptionTier: formData.subscriptionTier.replace('tier-', '').replace('proplus', 'ProPlus').replace('hobby', 'Hobby').replace('pro', 'Pro').replace('free', 'Free'),
            billingCycle: frequency.value === 'monthly' ? 'Monthly' : 'Annually'
            };
        
        console.log(formData.subscriptionTier)

        const response = await fetch('/api/account/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
    
        interface ApiError {
            message?: string;
          }
          
          if (!response.ok) {
            let errorData: ApiError = {};
          
            try {
              errorData = await response.json();
            } catch (err) {
              console.error('Could not parse JSON error:', err);
            }
          
            console.error('Registration error:', JSON.stringify(errorData, null, 2));
            alert('Registration failed:\n' + JSON.stringify(errorData['message'], null, 2));


            alert(errorData.message || 'Registration failed');
            return;
          }
          
    
        alert('Registration successful!');
        window.location.href = '/dashboard'; // or use navigate()
      } catch (err) {
        console.error('Network error:', err);
        alert('Something went wrong. Please try again.');
      }

  };


  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4">
      <InputField
            placeholder="Username"
            name="userName"
            type="text"
            value={formData.userName}
            onChange={handleChange}
            required
            icon={UserIcon}
        />
        <div className="grid grid-cols-2 gap-4">
        <InputField
            placeholder="First Name"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            required
            icon={UserIcon}
        />

        <InputField
            placeholder="Last Name"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            required
            icon={UserIcon}
        />
        </div>
        <InputField
            placeholder="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            icon={EmailIcon}
        />
        <div className="grid grid-cols-2 gap-4">
        <InputField
            placeholder="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            icon={PasswordIcon}
        />

        <InputField
            placeholder="Confirm Password"
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
                placeholder="Address"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                required
                icon={UserIcon}
            />
            {/* <InputField
                placeholder="Address Line 2 (optional)"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
            /> */}
            {/* <InputField
                placeholder="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
            /> */}
            {/* <InputField
                placeholder="State/Province"
                name="stateOrProvince"
                value={formData.stateOrProvince}
                onChange={handleChange}
                required
            />
            <InputField
                placeholder="ZIP/Postal Code"
                name="zipOrPostalCode"
                value={formData.zipOrPostalCode}
                onChange={handleChange}
                required
            /> */}
            <SelectField
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                options={countryOptions}
                placeholder="Select country"
                />
          </div>

          <div className="mt-6">
            <p className="text-base-content/70 mb-2">Choose Payment Method:</p>            
            <PaymentSelector selected={formData.paymentMethod} onSelect={(method) => setFormData(prev => ({ ...prev, paymentMethod: method }))} />
            {formData.paymentMethod === 'paypal' && (
                <div className="mt-4">
                <div id="paypal-button-container"></div>
                </div>
            )}
            {formData.paymentMethod === 'stripe' && (
                <div className="mt-4 bg-base-300 p-4 rounded">
                <p className="text-base-content/70 text-center">Stripe credit card form here</p>
                </div>
            )}
          </div>
        </>
      )}

      <button type="submit" className="btn btn-primary w-full mt-6">
        {selectedPlan.price[frequency.value] === '$0' ? 'Create Free Account' : 'Complete Registration'}
      </button>
    </form>
  );
}
