import { createContext, useContext } from 'react';
import { useUser } from './UserContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

type CurrencyContextType = {
  currency: string;
  setCurrency: (val: string) => Promise<void>;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  setCurrency: async () => {},
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const { user, refetchUser, isLoading } = useUser();

  const updateCurrency = async (newCurrency: string) => {
    console.log('[CurrencyContext] updating currency to', newCurrency);
    try {
      await fetch('/api/account/me/currency', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency: newCurrency }),
        credentials: 'include',
      });
      await refetchUser(); // Refresh user from source
    } catch (err) {
      console.error('Failed to update currency:', err);
    }
  };

  // Don't render until user is loaded
  if (isLoading || !user) return <LoadingSpinner />;

  return (
    <CurrencyContext.Provider value={{ currency: user.currency, setCurrency: updateCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
