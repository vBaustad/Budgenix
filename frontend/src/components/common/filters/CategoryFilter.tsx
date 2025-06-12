import { useState } from 'react';

type CategoryOption = {
  value: string;
  label: string;
};

type CategoryFilterProps = {
  options: CategoryOption[];
  selected: string[];
  onChange: (val: string[]) => void;
};

export default function CategoryFilter({
  options,
  selected,
  onChange,
}: CategoryFilterProps) {
  const [open, setOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState<string[]>(selected);

  const toggleCategory = (val: string) => {
    setTempSelected((prev) =>
      prev.includes(val)
        ? prev.filter((v) => v !== val)
        : [...prev, val]
    );
  };

  const apply = () => {
    onChange(tempSelected);
    setOpen(false);
  };

  const clear = () => {
    setTempSelected([]);
    onChange([]);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setTempSelected(selected);
          setOpen((o) => !o);
        }}
        className="hover:text-primary underline underline-offset-2 transition-colors"
      >
        {selected.length > 0 ? `Filter (${selected.length})` : 'Filter by Category'}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 z-50 w-64 bg-base-100 border border-primary rounded-xl shadow-md p-4">
          <div className="max-h-60 overflow-y-auto flex flex-col gap-2">
            {options.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={tempSelected.includes(opt.value)}
                  onChange={() => toggleCategory(opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          <div className="mt-4 flex justify-between">
            <button className="btn btn-xs btn-outline" onClick={clear}>
              Clear
            </button>
            <button className="btn btn-xs btn-primary" onClick={apply}>
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
