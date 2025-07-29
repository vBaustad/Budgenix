// src/modules/bankStatements/hooks/useBankStatements.ts

import { useMutation, useQuery } from '@tanstack/react-query';
import { ParsedTransactionDto } from '../types/bankStatements';
import { uploadBankStatement, fetchParsedTransactions } from '../services/bankStatementService';
import { ImportSummaryDto } from '../types/bankStatements';
import { importParsedTransactions } from '../services/bankStatementService';

export const BankStatementsQueryKeys = {
  parsed: ['bankStatements', 'parsed'] as const,
};

export const useParsedTransactions = (enabled = true) => {
  return useQuery<ParsedTransactionDto[]>({
    queryKey: BankStatementsQueryKeys.parsed,
    queryFn: fetchParsedTransactions,
    enabled,
  });
};

export const useUploadBankStatement = () => {
  return useMutation({
    mutationFn: ({ text, bank }: { text: string; bank: string }) =>
      uploadBankStatement(text, bank),
  });
};

export const useImportParsedTransactions = () => {
  return useMutation({
    mutationFn: (transactions: ParsedTransactionDto[]): Promise<ImportSummaryDto> =>
      importParsedTransactions(transactions),
  });
};
