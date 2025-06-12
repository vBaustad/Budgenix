import { useState, useEffect } from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { getCurrencySymbol } from '../../utils/formatting';

const currencies = [
  { code: 'USD', label: 'US Dollar' },
  { code: 'EUR', label: 'Euro' },
  { code: 'NOK', label: 'Norwegian Krone' },
  { code: 'GBP', label: 'British Pound' },
];

export default function CurrencyDropdown() {
  const { currency, setCurrency } = useCurrency();
  const [selected, setSelected] = useState(currency);

  // Sync if context updates
  useEffect(() => {
    setSelected(currency);
  }, [currency]);

  const handleChange = async (newCurrency: string) => {
    setSelected(newCurrency); // Optimistically update
    await setCurrency(newCurrency); // Update server
  };

  return (
    <div className="dropdown dropdown-end">
      <label
        tabIndex={0}
        className="text-sm font-medium text-base-content hover:text-primary cursor-pointer"
      >
        Currency: {selected}
      </label>

      <ul
        tabIndex={0}
        className="dropdown-content mt-2 z-[1] bg-base-100 rounded-box border border-base-300 p-2 shadow-md w-52"
      >
        {currencies.map((c) => (
          <li key={c.code}>
            <button
              onClick={() => handleChange(c.code)}
              className={`w-full text-left px-2 py-1 rounded hover:bg-base-200 ${
                selected === c.code ? 'font-bold' : ''
              }`}
            >
              {getCurrencySymbol(c.code)} – {c.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
