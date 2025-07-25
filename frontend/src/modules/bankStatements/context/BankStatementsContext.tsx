// src/modules/bankStatements/context/BankStatementsContext.tsx

import { createContext, useContext, useMemo, useState, useCallback, ReactNode } from 'react';
import { ParsedTransactionDto } from '../types/bankStatements';
import { useParsedTransactions } from '../hooks/useBankStatements';

interface BankStatementsContextType {
  parsedTransactions: ParsedTransactionDto[];
  loading: boolean;
  refetchTransactions: () => void;
  clearTransactions: () => void;
}

const BankStatementsContext = createContext<BankStatementsContextType | undefined>(undefined);

export const BankStatementsProvider = ({ children }: { children: ReactNode }) => {
  const [enabled, setEnabled] = useState(true);
  const { data = [], isLoading, refetch } = useParsedTransactions(enabled);

  const refetchTransactions = useCallback(() => {
    setEnabled(true);
    refetch();
  }, [refetch]);

  const clearTransactions = useCallback(() => {
    setEnabled(false);
  }, []);

  const value = useMemo(
    () => ({
      parsedTransactions: data,
      loading: isLoading,
      refetchTransactions,
      clearTransactions
    }),
    [data, isLoading, refetchTransactions, clearTransactions]
  );

  return (
    <BankStatementsContext.Provider value={value}>
      {children}
    </BankStatementsContext.Provider>
  );
};

export function useBankStatementsContext() {
  const context = useContext(BankStatementsContext);
  if (!context) {
    throw new Error('useBankStatementsContext must be used within a BankStatementsProvider');
  }
  return context;
}
