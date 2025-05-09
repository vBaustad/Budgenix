import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(enLocale);

export const countryOptions = Object.entries(
  countries.getNames('en', { select: 'official' })
)
  .map(([code, name]) => ({ value: code, label: name }))
  .sort((a, b) => a.label.localeCompare(b.label));
