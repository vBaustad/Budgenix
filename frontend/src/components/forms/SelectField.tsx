type SelectFieldProps = {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
    options: { value: string; label: string }[];
    placeholder?: string;
  };
  

  export default function SelectField({
    name,
    value,
    onChange,
    required = false,
    options,
    placeholder,
  }: SelectFieldProps) {
    return (
      <div>       
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`select select-bordered w-full`}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
        </select>
      </div>
    );
  }