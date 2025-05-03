import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { tiers } from '../../utils/plans';
import { Radio, RadioGroup } from '@headlessui/react'

function classNames(...classes: (string | boolean | undefined | null)[]) {
    return classes.filter(Boolean).join(' ')
  }

  type FrequencyValue = 'monthly' | 'annually';

  const frequencies: { value: FrequencyValue; label: string; priceSuffix: string; }[] = [
    { value: 'monthly', label: 'Monthly', priceSuffix: '/month' },
    { value: 'annually', label: 'Annually', priceSuffix: '/year' },
  ];

export default function RegisterPage() {
    const [searchParams] = useSearchParams();
    const planId = searchParams.get('plan') || 'free';
    const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'stripe'>('paypal');
    const selectedPlan = tiers.find((tier) => tier.id === planId) || tiers[0];
    const navigate = useNavigate();
    const [frequency, setFrequency] = useState<'monthly' | 'annually'>('monthly');


    return (
        <div className="bg-gray-900 min-h-screen flex flex-col justify-center items-center px-4 py-12 pt-24">
            <section className="max-w-6xl w-full mx-auto py-16 px-4 text-center">
                <h2 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h2>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    Whether you're just starting or you're a budgeting pro, we have a plan that fits your needs.
                </p>
                <div className="mt-16 flex justify-center">
                <fieldset aria-label="Payment frequency">
                <RadioGroup
                    value={frequency}
                    onChange={setFrequency}
                    className="grid grid-cols-2 gap-x-1 rounded-full bg-white/5 p-1 text-center text-xs/5 font-semibold text-white"
                >
                    {frequencies.map((option) => (
                        <Radio
                            key={option.value}
                            value={option.value} // now it's just 'monthly' or 'annually'
                            className={({ checked }) =>
                                classNames(
                                    checked ? 'bg-indigo-500 text-white' : 'text-white',
                                    'cursor-pointer rounded-full px-2.5 py-1 transition'
                                )
                            }
                        >
                            {option.label}
                        </Radio>
                    ))}
                </RadioGroup>

                </fieldset>
                </div>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 w-full max-w-6xl mx-auto pt-24">                
                    {tiers.map((tier) => (
                        <div
                        key={tier.id}
                        onClick={() => {
                            navigate(`/register?plan=${tier.id}`);
                        }}
                        className={`
                            cursor-pointer rounded-3xl p-6 xl:p-8 border transition-all
                            ${selectedPlan.id === tier.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-indigo-400'}
                        `}
                        >
                        <h3 className="text-lg font-semibold text-white flex items-center justify-between">
                            {tier.name}
                            {selectedPlan.id === tier.id && (
                            <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full ml-2">
                                Selected
                            </span>
                            )}
                        </h3>
                        <p className="mt-2 text-sm text-gray-300">{tier.description}</p>
                        <p className="mt-4 text-3xl font-bold text-white">
                            {frequency === 'monthly' ? tier.price.monthly : tier.price.annually}
                            <span className="text-base text-gray-400"> / {frequency}</span>
                        </p>
                        <ul className="mt-4 space-y-2 text-sm text-gray-400">
                            {tier.features.map((feature) => (
                            <li key={feature} className="flex items-center">
                                <span className="mr-2 text-indigo-400">✔</span> {feature}
                            </li>
                            ))}
                        </ul>
                        </div>
                    ))}          
                </div>
            </section>
            
            <div className="w-full max-w-6xl border-t border-white/10 my-12"></div>

            <form className="bg-gray-900 flex flex-col justify-center items-center px-4 py-12">
                <div className="max-w-4xl w-full bg-gray-800 rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">                        
                    {/* Left side: Plan info */}
                    <div className="p-8 bg-indigo-500 flex flex-col justify-center text-white">
                        <h2 className="text-3xl font-bold mb-2">{selectedPlan.name} Plan</h2>
                        <p className="text-indigo-100 mb-4">{selectedPlan.description}</p>
                        <p className="text-4xl font-bold mb-6">
                            {selectedPlan.price.monthly === '$0' ? 'Free' : `${selectedPlan.price.monthly} / month`}
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-indigo-100">
                            {selectedPlan.features.map((feature) => (
                                <li key={feature}>{feature}</li>
                            ))}
                        </ul>
                    </div>
                    {/* Right side: Form */}
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Create your account</h2>
                        <form>
                            <div className="grid grid-cols-1 gap-4">
                                <input placeholder="First Name" className="rounded px-3 py-2 bg-white/5 text-white" required />
                                <input placeholder="Last Name" className="rounded px-3 py-2 bg-white/5 text-white" required />
                                <input placeholder="Email" type="email" className="rounded px-3 py-2 bg-white/5 text-white" required />
                                <input placeholder="Password" type="password" className="rounded px-3 py-2 bg-white/5 text-white" required />
                            </div>
                            {/* Payment method (if needed) */}
                            {selectedPlan.price.monthly !== '$0' && (
                                <div className="mt-6">
                                    <p className="text-gray-300 mb-2">Choose Payment Method:</p>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('paypal')}
                                            className={`flex-1 py-2 rounded ${paymentMethod === 'paypal' ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                                        >
                                            PayPal
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('stripe')}
                                            className={`flex-1 py-2 rounded ${paymentMethod === 'stripe' ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                                        >
                                            Credit Card
                                        </button>
                                    </div>

                                    {paymentMethod === 'paypal' && (
                                        <div className="mt-4">
                                            {/* PayPal button container */}
                                            <div id="paypal-button-container"></div>
                                        </div>
                                    )}

                                    {paymentMethod === 'stripe' && (
                                        <div className="mt-4 bg-gray-700 p-4 rounded">
                                            {/* Placeholder for Stripe Elements */}
                                            <p className="text-gray-400 text-center">Stripe credit card form here</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full mt-6 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-2 px-4 rounded"
                            >
                                {selectedPlan.price.monthly === '$0' ? 'Create Free Account' : 'Complete Registration'}
                            </button>
                        </form>

                            <p className="mt-6 text-center text-gray-400 text-sm">
                            Already have an account?{' '}
                                <a href="/login" className="text-indigo-400 hover:underline">
                                    Log in here
                                </a>
                            </p>
                    </div>
                </div>
            </form>
        </div>
    );
}
