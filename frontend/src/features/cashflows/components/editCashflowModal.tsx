import { Dialog } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { useCategories } from '@/context/CategoryContext';

import type { RecurrenceFrequency } from '@/types/shared/recurrence';
import type { CashflowItem } from '@/types/finance/cashflow';

import InputField from '@/components/common/forms/InputField';
import SelectField from '@/components/common/forms/SelectField';

interface Props {
  open: boolean;
  item: Partial<CashflowItem>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const frequencyOptions: { value: RecurrenceFrequency; label: string }[] = [
  { value: 'Daily', label: 'cashflow.frequency.Daily' },
  { value: 'Weekly', label: 'cashflow.frequency.Weekly' },
  { value: 'Monthly', label: 'cashflow.frequency.Monthly' },
  { value: 'Yearly', label: 'cashflow.frequency.Yearly' },
];

export function EditCashflowModal({ open, item, onChange, onClose, onSubmit }: Props) {
  const { t } = useTranslation();
  const { categories = [] } = useCategories();

  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-30" />
      <div className="relative bg-base-100 rounded-lg p-6 shadow-lg w-full max-w-md">
        <Dialog.Title className="text-lg font-semibold">
          {item.type === 'Income'
            ? t('cashflow.editIncome')
            : item.type === 'Expense'
            ? t('cashflow.editExpense')
            : t('cashflow.edit')}
        </Dialog.Title>

        <div className="space-y-3 mt-4">
          <InputField
            name="name"
            value={item.name ?? ''}
            onChange={onChange}
            placeholder={t('cashflow.table.name')}
          />

          <InputField
            name="amount"
            type="number"
            value={item.amount?.toString() ?? ''}
            onChange={onChange}
            placeholder={t('cashflow.table.amount')}
            showCurrency
          />

          <InputField
            name="person"
            value={item.person ?? ''}
            onChange={onChange}
            placeholder={t('cashflow.table.person')}
          />

          <SelectField
            name="categoryId"
            value={item.categoryId ?? ''}
            onChange={onChange}
            placeholder={t('shared.uncategorized')}
            label={t('shared.category')}
            options={categories.map(cat => ({
              value: cat.id,
              label: cat.name,
            }))}
          />

          <SelectField
            name="frequency"
            value={item.frequency ?? ''}
            onChange={onChange}
            placeholder={t('cashflow.table.frequency')}
            options={frequencyOptions.map(opt => ({
              value: opt.value,
              label: t(opt.label),
            }))}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="btn btn-ghost">
            {t('shared.cancel')}
          </button>
          <button onClick={onSubmit} className="btn btn-primary">
            {t('shared.save')}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
