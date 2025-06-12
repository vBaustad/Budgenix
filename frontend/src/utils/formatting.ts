export function getCurrencySymbol(currency: string | undefined | null): string {
  if (!currency) return '?';
  switch (currency.toUpperCase()) {
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    case 'NOK':
      return 'kr';
    default:
      return currency;
  }
}


export const getDefaultLocaleForCurrency = (currency: string): string => {
  switch (currency.toUpperCase()) {
    case 'NOK':
    case 'SEK':
    case 'DKK':
      return 'nb-NO'; // Norwegian style
    case 'EUR':
      return 'de-DE'; // or 'fr-FR', 'es-ES', etc.
    case 'GBP':
      return 'en-GB';
    case 'USD':
    default:
      return 'en-US';
  }
};

export function getRecurrenceLabel(value: string): string {
  switch (value) {
    case 'Daily': return 'Daily';
    case 'Weekly': return 'Weekly';
    case 'BiWeekly': return 'Bi-Weekly';
    case 'Monthly': return 'Monthly';
    case 'Quarterly': return 'Quarterly';
    case 'Yearly': return 'Yearly';
    case 'None': return 'One-time';
    default: return 'Unknown';
  }
}





export const formatCurrency = (
  val: unknown,
  currency: string = 'USD',
  locale?: string
): string => {
  if (typeof val !== 'number') return '–';

  // Auto-assign common locale if none provided
  const resolvedLocale = locale ?? getDefaultLocaleForCurrency(currency);

  try {
    return new Intl.NumberFormat(resolvedLocale, {
      style: 'currency',
      currency,
      currencyDisplay: 'symbol',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(val);
  } catch {
    return `${getCurrencySymbol(currency)}${val.toFixed(2)}`;
  }
};




export const formatDate = (val: unknown): string =>
  val ? new Date(val as string).toLocaleDateString() : '–';

export const truncateText = (val: unknown, max = 60): string =>
  typeof val === 'string' ? val.slice(0, max) + (val.length > max ? '...' : '') : '–';
