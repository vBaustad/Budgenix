import { useState, useEffect, useRef } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { getCurrencySymbol } from '@/utils/formatting';
import { ChevronDown, CheckCircle2 } from 'lucide-react';

const currencies = [
  { code: 'USD', label: 'US Dollar' },
  { code: 'EUR', label: 'Euro' },
  { code: 'NOK', label: 'Norwegian Krone' },
  { code: 'GBP', label: 'British Pound' },
];

export default function CurrencyDropdown() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const current = currencies.find(c => c.code === currency);  

  const handleSelect = async (code: string) => {
    setOpen(false);
    await setCurrency(code);
  };

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block w-full">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="btn btn-sm btn-outline flex items-center justify-between w-full min-w-[10rem]"
      >
        <span>{current ? current.label : 'Select Currency'}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-base-200 rounded shadow border border-base-300 max-h-60 overflow-auto">
          {currencies.map(c => (
            <button
              key={c.code}
              onClick={() => handleSelect(c.code)}
              className={`flex items-center justify-between w-full px-4 py-2 text-left text-sm hover:bg-base-300 ${
                currency === c.code ? 'font-bold' : ''
              }`}
            >
              <span>
                {getCurrencySymbol(c.code)} – {c.label}
              </span>
              {currency === c.code && (
                <CheckCircle2 className="w-4 h-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
