import { useState } from 'react';
import { ParsedTransactionDto, BankTransactionType } from '../types/bankStatements';
import { useCategories } from '@/context/CategoryContext';
import { useCurrency } from '@/context/CurrencyContext';
import { formatCurrency, formatDateInputValue } from '@/utils/formatting';

interface Props {
  transactions: ParsedTransactionDto[];
  onClose: () => void;
  onSave: (updated: ParsedTransactionDto[]) => void;
}

export default function ReviewParsedTransactionsModal({ transactions, onClose, onSave }: Props) {
  const { categories } = useCategories();
  const { currency } = useCurrency();
  const [edited, setEdited] = useState<ParsedTransactionDto[]>([...transactions]);

  const updateField = <K extends keyof ParsedTransactionDto>(
    index: number,
    field: K,
    value: ParsedTransactionDto[K]
  ) => {
    const updated = [...edited];
    updated[index] = { ...updated[index], [field]: value };
    setEdited(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-auto p-6">
        <h2 className="text-xl font-bold mb-4">Review Transactions</h2>
        <table className="table table-sm w-full">
          <thead>
            <tr>
              <th>Description</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Internal Transfer</th>
              <th>Category</th>
              <th>Type</th>
              <th>Income?</th>
            </tr>
          </thead>
          <tbody>
            {edited.map((tx, idx) => (
              <tr key={idx}>
                <td>
                  <input
                    type="text"
                    className="input input-xs w-full"
                    value={tx.description}
                    onChange={(e) => updateField(idx, 'description', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="date"
                    className="input input-xs"
                    value={formatDateInputValue(tx.date)}
                    onChange={(e) => updateField(idx, 'date', e.target.value)}
                  />
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className="input input-xs w-24"
                      value={tx.amount}
                      onChange={(e) =>
                        updateField(idx, 'amount', parseFloat(e.target.value))
                      }
                    />
                    <span className="text-xs text-base-content/60">
                      {formatCurrency(tx.amount, currency)}
                    </span>
                  </div>
                </td>
                <td>
                  <select
                    className="select select-xs w-full"
                    value={tx.isInternalTransfer?.toString() ?? ""}
                    onChange={(e) => updateField(idx, 'isInternalTransfer', e.target.value === 'true' ? true : false)}
                  >
                    <option value="">Unknown / Not Set</option>
                    <option key='true' value={'true'}>
                      True
                    </option>
                    <option key='false' value={'false'}>
                      False
                    </option>
                  </select>
                </td>
                <td>
                  <select
                    className="select select-xs w-full"
                    value={tx.category ?? ''}
                    onChange={(e) => updateField(idx, 'category', e.target.value)}
                  >
                    <option value="">(none)</option>
                    {categories.map((cat) => (
                      <option key={cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    className="select select-xs w-full"
                    value={tx.transactionType}
                    onChange={(e) =>
                      updateField(idx, 'transactionType', Number(e.target.value) as unknown as BankTransactionType)
                    }
                  >
                    {Object.entries(BankTransactionType).map(([key, val]) => (
                      <option key={key} value={val}>
                        {key}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={tx.isIncome}
                    onChange={(e) => updateField(idx, 'isIncome', e.target.checked)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end gap-2 mt-4">
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onSave(edited)}
          >
            Save All
          </button>
        </div>
      </div>
    </div>
  );
}
