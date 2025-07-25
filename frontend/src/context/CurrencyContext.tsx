import { createContext, useContext, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../utils/api';
import { useUser } from './UserContext';
type CurrencyContextType = {
  currency?: string; // nullable so consumer handles if missing
  setCurrency: (newCurrency: string) => void;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: undefined,
  setCurrency: () => {},
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const { user, cachedUser, isLoading } = useUser();
  const queryClient = useQueryClient();

  const [currency, setLocalCurrency] = useState<string | undefined>(
    user?.currency || cachedUser?.currency
  );
  
  useEffect(() => {
    
    if (user?.currency && user.currency !== currency) {
      setLocalCurrency(user.currency);
    }
  }, [user?.currency]);


  const { mutateAsync: updateCurrency } = useMutation({
    mutationFn: async (newCurrency: string) => {
      return apiFetch('/api/user/me/currency', {
        method: 'PUT',
        body: JSON.stringify({ currency: newCurrency }),
      });
    },
    onSuccess: async (_, newCurrency) => {
      setLocalCurrency(newCurrency);
      await queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (err) => {
      console.error('[CurrencyProvider] Currency change failed:', err);
    },
  });

  const handleSetCurrency = (newCurrency: string) => {
    updateCurrency(newCurrency);
  };

 
  if (!currency && isLoading) return null;

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}



export const useCurrency = () => useContext(CurrencyContext);

