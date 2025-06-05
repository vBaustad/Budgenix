import { useState } from 'react';
import { CreateExpenseDto, Expense } from '@/types/finance/expense';
import {  RecurrenceFrequencyOptions } from '@/types/shared/recurrence';
import { createExpense } from '../services/expensesService';
import InputField from '@/components/common/forms/InputField';
import SelectField from '@/components/common/forms/SelectField';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/utils/formatting';
import { useCurrency } from '@/context/CurrencyContext';
import { useCategories } from '@/context/CategoryContext';

type Props = {
  onAdd: (expense: Expense) => void;
  onRecurringChange?: () => Promise<void>;
};

export default function AddExpenseForm({ onAdd, onRecurringChange }: Props) {
  const [form, setForm] = useState<CreateExpenseDto>({
    name: '',
    description: '',
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    categoryId: '',
    recurrenceFrequency: 'None',
    notes: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isRecurring = form.recurrenceFrequency !== 'None';

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: CreateExpenseDto = {
        ...form,
      };

      const newExpense = await createExpense(payload);
      onAdd(newExpense);

      if (isRecurring && onRecurringChange) {
        await onRecurringChange();
      }

      toast.success('Expense added successfully!');
      setForm({
        name: '',
        description: '',
        amount: 0,
        date: new Date().toISOString().slice(0, 10),
        categoryId: '',
        recurrenceFrequency: 'None',
        notes: '',
      });
    } catch (err: unknown) {
      toast.error('Failed to add expense');
      setError(err instanceof Error ? err.message : 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const { categories } = useCategories();
  const { currency: userCurrency } = useCurrency();

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl">
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-2 gap-4">
          <InputField
            name="name"
            type="text"
            placeholder="Expense name"
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
          <SelectField
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            placeholder="Select a category"
          />
          <InputField
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <SelectField
          name="recurrenceFrequency"
          value={form.recurrenceFrequency}
          onChange={handleChange}
          options={[{ value: 'None', label: 'Not Recurring' }, ...RecurrenceFrequencyOptions]}
        />

        <InputField
          name="description"
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        {error && <p className="text-error">{error}</p>}

        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Saving...' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
}
