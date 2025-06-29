'use client';

import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Expense } from '@/types/finance/expense';
import { useCreateExpense } from '../services/expensesService';
import InputField from '@/components/common/forms/InputField';
import SelectField from '@/components/common/forms/SelectField';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/utils/formatting';
import { useCurrency } from '@/context/CurrencyContext';
import { useCategories } from '@/context/CategoryContext';

type Props = {
  onAdd: (expense: Expense) => void;
  onClose: () => void;
};

type ExpenseFormState = {
  name: string;
  description?: string;
  amount: number;
  date: string;
  categoryId: string;
  notes?: string;
};

export default function AddExpenseModal({ onAdd, onClose }: Props) {
  const { t } = useTranslation();
  const [form, setForm] = useState<ExpenseFormState>({
    name: '',
    description: '',
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    categoryId: '',
    notes: '',
  });

  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: createExpense, isPending: loading } = useCreateExpense();
  const { categories } = useCategories();
  const { currency: userCurrency } = useCurrency();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const newExpense = await createExpense(form);
      onAdd(newExpense);
      toast.success(t('expenses.toast.createSuccess'));
      onClose();
      setForm({
        name: '',
        description: '',
        amount: 0,
        date: new Date().toISOString().slice(0, 10),
        categoryId: '',
        notes: '',
      });
    } catch (err: unknown) {
      toast.error(t('expenses.toast.createError'));
      setError(err instanceof Error ? err.message : t('shared.unknown'));
    }
  };

  return (
    <Dialog open onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30" />
      <Dialog.Panel className="bg-base-100 rounded-xl p-6 shadow-lg max-w-md w-full z-50">
        <Dialog.Title className="text-lg font-bold mb-4">{t('expenses.add')}</Dialog.Title>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            name="name"
            type="text"
            placeholder={t('expenses.form.namePlaceholder')}
            value={form.name}
            onChange={handleChange}
            required
          />
          <InputField
            name="amount"
            type="number"
            value={form.amount === 0 ? '' : form.amount.toString()}
            placeholder={formatCurrency(0, userCurrency)}
            onChange={handleChange}
            showCurrency
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <SelectField
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              options={categories
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((c) => ({ value: c.id, label: c.name }))}
              placeholder={t('expenses.form.selectCategoryPlaceholder')}
            />
            <InputField
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
          <InputField
            name="description"
            type="text"
            placeholder={t('expenses.form.descriptionPlaceholder')}
            value={form.description || ''}
            onChange={handleChange}
          />
          {error && <p className="text-error">{error}</p>}

          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              {t('shared.cancel')}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t('shared.saving') : t('expenses.add')}
            </button>
          </div>
        </form>
      </Dialog.Panel>
    </Dialog>
  );
}
