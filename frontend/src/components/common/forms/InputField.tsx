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
  icon?: React.ReactNode;
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
  icon,
  minLength,
  maxLength,
  pattern,
  title,
  hint,
  size,
  showCurrency = false, // default off
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
        {/* Leading icon inside input */}
        {/* {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/70 pointer-events-none">
            {icon}
          </span>
        )} */}

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
          inputMode={type === 'number' ? 'decimal' : undefined}
          className={`input input-bordered w-full pr-12 ${
            icon ? 'pl-10' : ''
          }`}
        />

        {/* Trailing currency symbol */}
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