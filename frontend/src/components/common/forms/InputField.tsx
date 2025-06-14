import React from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { getCurrencySymbol } from '@/utils/formatting';

type InputFieldProps = {
  name: string;
  type?: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  title?: string;
  hint?: string;
  size?: 'full' | 'half';
  showCurrency?: boolean;
};

export default function InputField({
  name,
  value,
  type = 'text',
  label,
  placeholder,
  onChange,
  required = false,
  minLength,
  maxLength,
  pattern,
  title,
  hint,
  size,
  showCurrency = false,
}: InputFieldProps) {
  const { currency: userCurrency } = useCurrency();
  const displayCurrency = showCurrency ? getCurrencySymbol(userCurrency) : '';

  return (
    <div>
      {label && (
        <label className="label">
          <span className="label-text text-base-content">{label}</span>
        </label>
      )}

      <div className={`relative ${size === 'half' ? 'w-1/2' : 'w-full'}`}>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          pattern={pattern}
          title={title}
          placeholder={placeholder}
          autoComplete="off"
          inputMode={type === 'number' ? 'decimal' : undefined}
          className={`input input-bordered text-base-content w-full ${
            displayCurrency ? 'pr-8' : ''
          }`}
        />

        {displayCurrency && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/70 text-sm pointer-events-none">
            {displayCurrency}
          </span>
        )}
      </div>

      {hint && (
        <p className="validator-hint text-sm text-base-content/70">{hint}</p>
      )}
    </div>
  );
}
