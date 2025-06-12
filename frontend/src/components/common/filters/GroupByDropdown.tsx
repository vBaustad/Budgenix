import { useState } from 'react';

type GroupByValue = 'month' | 'year' | 'category' | '';

type GroupByDropdownProps = {
  value: GroupByValue;
  onChange: (val: GroupByValue) => void;
  options: { value: GroupByValue; label: string }[];
};


export default function GroupByDropdown({ value, onChange, options }: GroupByDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="hover:text-primary underline underline-offset-2 transition-colors"
      >
        {'Group By'}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 z-50 w-48 bg-base-100 border border-primary rounded-xl shadow-md p-4">
          {options.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="groupBy"
                value={opt.value}
                checked={value === opt.value}
                onChange={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className="radio radio-sm"
              />
              {opt.label}
            </label>
          ))}

          <button
            className="mt-3 btn btn-xs btn-outline w-full"
            onClick={() => {
              onChange('');
              setOpen(false);
            }}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
