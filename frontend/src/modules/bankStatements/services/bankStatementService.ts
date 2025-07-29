// src/modules/bankStatements/services/bankStatementService.ts

import { apiFetch } from '@/utils/api';
import { ImportSummaryDto, ParsedTransactionDto } from '../types/bankStatements';

const API_URL = '/api/bank-statements';

export async function uploadBankStatement(text: string, bank: string): Promise<ParsedTransactionDto[]> {
  const result = await apiFetch<ParsedTransactionDto[]>(`${API_URL}/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, bank }),
  });

  return result || [];
}


export async function fetchParsedTransactions(): Promise<ParsedTransactionDto[]> {
  const result = await apiFetch<ParsedTransactionDto[]>(`${API_URL}/parsed`);
  return result || [];
}

export async function importParsedTransactions(transactions: ParsedTransactionDto[]): Promise<ImportSummaryDto> {
  const result = await apiFetch<ImportSummaryDto>(`${API_URL}/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transactions),
  });

  return result!;
}