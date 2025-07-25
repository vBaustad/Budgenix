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
      return 'nb-NO';
    case 'EUR':
      return 'de-DE';
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
  if (typeof val !== 'number' || isNaN(val)) return '–';

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
    return `${getCurrencySymbol(currency)} ${val.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  }
};





export const formatDate = (val: unknown): string =>
  val ? new Date(val as string).toLocaleDateString() : '–';

export const formatDateInputValue = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0]; // yyyy-MM-dd
};


export const truncateText = (
  val: string | number | null | undefined,
  max = 60
): string => {
  if (typeof val === 'string') {
    return val.length > max ? val.slice(0, max) + '…' : val;
  }
  if (typeof val === 'number') {
    const str = val.toString();
    return str.length > max ? str.slice(0, max) + '…' : str;
  }
  return '–';
};

