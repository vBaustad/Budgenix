export type ParsedTransactionDto = {
  description: string;
  date: string; // ISO 8601 format e.g. "2025-04-01"
  amount: number;
  isIncome: boolean;
  transactionType: BankTransactionType;
  category?: string | null;
  isInternalTransfer?: boolean;
};

export enum BankTransactionType {
  Unknown = 'Unknown',
  Income = 'Income',
  Refund = 'Refund',
  Savings = 'Savings',
  CardPayment = 'CardPayment',
  Purchase = 'Purchase',
  TransferOut = 'TransferOut'
}
