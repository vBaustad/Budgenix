type SelectFieldProps = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
  label?: string;
};

export default function SelectField({
  name,
  value,
  onChange,
  required = false,
  options,
  placeholder,
  label,
}: SelectFieldProps) {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text text-base-content">{label}</span>
        </label>
      )}

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="select select-bordered text-base-content w-full"
      >
        {placeholder && (
          <option value="">{placeholder}</option>
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
