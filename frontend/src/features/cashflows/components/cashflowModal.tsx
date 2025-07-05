import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCashflowContext } from '@/features/cashflows/context/CashflowContext';
import { CreateCashflowItemDto  } from '@/types/finance/cashflow';
import { useCategories } from '@/context/CategoryContext';
import { RecurrenceFrequencyOptions, RecurrenceFrequency } from '@/types/shared/recurrence';

export function CashflowModal({
  type,
  onClose,
}: {
  type: 'income' | 'expense';
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { createItem } = useCashflowContext();
  const { categories = [] } = useCategories();


  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [person, setPerson] = useState('');
  const [frequency, setFrequency] = useState<RecurrenceFrequency>('Monthly');
  const [categoryId, setCategoryId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dto: CreateCashflowItemDto = {
        name,
        amount: parseFloat(amount),
        type: type === 'income' ? 'Income' : 'Expense',
        frequency,
        person: person ? person : undefined,
        categoryId: categoryId ? categoryId : undefined,
    };


    try {
      await createItem(dto);
      onClose();
    } catch (err) {
      console.error('Failed to create item:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded shadow-xl w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {type === 'income' ? t('cashflow.addIncome') : t('cashflow.addExpense')}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">{t('cashflow.table.name')}</label>
            <input
              className="input input-bordered w-full"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">{t('cashflow.table.amount')}</label>
            <input
              className="input input-bordered w-full"
              type="number"
              min={0}
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">{t('cashflow.table.person')}</label>
            <input
              className="input input-bordered w-full"
              value={person}
              onChange={e => setPerson(e.target.value)}
              placeholder={t('cashflow.unknownPerson') || 'Unknown'}
            />
          </div>

          <div>
            <label className="label">{t('cashflow.table.frequency')}</label>
            <select
              className="select select-bordered w-full"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as RecurrenceFrequency)}
            >
              {RecurrenceFrequencyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {t(`shared.recurrence.${option.value}`)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">{t('shared.category')}</label>
            <select
              className="select select-bordered w-full"
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
            >
              <option value="">{t('shared.uncategorized')}</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              className="btn btn-sm btn-ghost"
              onClick={onClose}
            >
              {t('buttons.cancel')}
            </button>
            <button type="submit" className="btn btn-sm btn-primary">
              {t('buttons.save')}
            </button>
          </div>
        </form>
      </div>
    </div>    
  );  
}

