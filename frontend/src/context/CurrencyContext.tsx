import { createContext, useContext, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from './UserContext';

type CurrencyContextType = {
  currency: string;
  setCurrency: (newCurrency: string) => void;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  setCurrency: () => {},
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const [currency, setCurrencyState] = useState('USD');

  useEffect(() => {
    if (user?.currency) {
      setCurrencyState(user.currency);
    }
  }, [user?.currency]);


  const { mutate: updateCurrency } = useMutation({
    mutationFn: async (newCurrency: string) => {
      await fetch('/api/account/me/currency', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currency: newCurrency }),
      });
    },
    onSuccess: (_, newCurrency) => {
      setCurrencyState(newCurrency); // update instantly
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: updateCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}


export const useCurrency = () => useContext(CurrencyContext);
