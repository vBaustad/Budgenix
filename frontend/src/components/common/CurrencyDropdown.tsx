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

  return (
    <div className="dropdown dropdown-end">
      <label
        tabIndex={0}
        className="text-sm font-medium text-base-content hover:text-primary cursor-pointer"
      >
        Currency: {currency}
      </label>

      <ul
        tabIndex={0}
        className="dropdown-content mt-2 z-[1] bg-base-100 rounded-box border border-base-300 p-2 shadow-md w-52"
      >
        {currencies.map((c) => (
          <li key={c.code}>
            <button
              onClick={() => setCurrency(c.code)}
              className={`w-full text-left px-2 py-1 rounded hover:bg-base-200 ${
                currency === c.code ? 'font-bold' : ''
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
