import React from 'react';

type InputFieldProps = {
  name: string;
  type?: string;
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
};

export default function InputField({
    name,
    value,
    type = 'text',
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
}: InputFieldProps) {
  return (
    <div>
      <label className={`input validator input-bordered ${size === 'half' ? 'w-1/2' : 'w-full'}`}>
        {icon}
        <input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          pattern={pattern}
          title={title}
          className="tabular-nums"
        />
      </label>
      {hint && <p className="validator-hint text-sm text-base-content/70">{hint}</p>}
    </div>
  );
}
