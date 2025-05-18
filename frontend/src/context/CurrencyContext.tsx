import { createContext, useContext, useEffect, useState } from 'react';

type CurrencyContextType = {
  currency: string;
  setCurrency: (val: string) => void;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  setCurrency: () => {}, // no val needed here
});


export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<string | null>(null);

useEffect(() => {
  fetch('/api/account/me/currency')
    .then(res => {
      if (!res.ok) throw new Error(`Failed with status ${res.status}`);
      return res.json(); // only attempt to parse if successful
    })
    .then(data => setCurrency(data.currency))
    .catch(err => {
      console.error('Failed to fetch currency:', err);
      setCurrency('USD');
    });
}, []);


const updateCurrency = async (newCurrency: string) => {
    await fetch('/api/account/me/currency', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currency: newCurrency }),
    });
    setCurrency(newCurrency);
  };

  if (currency === null) return null;

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: updateCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
