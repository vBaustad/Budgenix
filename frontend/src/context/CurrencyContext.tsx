import { createContext, useContext, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from './UserContext';
import { apiFetch } from '../utils/api';

type CurrencyContextType = {
  currency?: string; // nullable so consumer handles if missing
  setCurrency: (newCurrency: string) => void;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: undefined,
  setCurrency: () => {},
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [currency, setLocalCurrency] = useState<string | undefined>(user?.currency);

  useEffect(() => {
    if (user?.currency !== currency) {
      setLocalCurrency(user?.currency);
    }
  }, [user?.currency]);

const { mutate: updateCurrency } = useMutation({
  mutationFn: async (newCurrency: string) => {
    return apiFetch('/api/account/me/currency', {
      method: 'PUT',
      body: JSON.stringify({ currency: newCurrency }),
    });
  },
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ['user'] });
    await queryClient.refetchQueries({ queryKey: ['user'] });
  },
  onError: (err) => {
    console.error('[CurrencyProvider] Currency change failed:', err);
  },
});


  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: updateCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
