import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCashflowContext } from '@/features/cashflows/context/CashflowContext';
import { CreateCashflowItemDto } from '@/types/finance/cashflow';
import { useCategories } from '@/context/CategoryContext';
import { RecurrenceFrequencyOptions, RecurrenceFrequency } from '@/types/shared/recurrence';
import InputField from '@/components/common/forms/InputField';
import SelectField from '@/components/common/forms/SelectField';


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
      person: person || undefined,
      categoryId: categoryId || undefined,
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
          <InputField
            name="name"
            label={t('cashflow.table.name')}
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <InputField
            name="amount"
            label={t('cashflow.table.amount')}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            type="number"
            required
            showCurrency
          />

          <InputField
            name="person"
            label={t('cashflow.table.person')}
            value={person}
            onChange={e => setPerson(e.target.value)}
            placeholder={t('cashflow.unknownPerson') || 'Unknown'}
          />

          <SelectField
            name="categoryId"
            label={t('shared.category')}
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            placeholder={t('shared.uncategorized')}
            options={categories.map(cat => ({
              value: cat.id,
              label: cat.name,
            }))}
          />
          <SelectField
            name="frequency"
            label={t('cashflow.table.frequency')}
            value={frequency}
            onChange={e => setFrequency(e.target.value as RecurrenceFrequency)}
            options={RecurrenceFrequencyOptions.map(option => ({
              value: option.value,
              label: t(`shared.recurrence.${option.value}`),
            }))}
          />
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
