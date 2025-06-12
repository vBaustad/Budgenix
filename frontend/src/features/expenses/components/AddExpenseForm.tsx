import { useState } from 'react';
import { Expense } from '@/types/finance/expense';
import { RecurrenceFrequency, RecurrenceFrequencyOptions } from '@/types/shared/recurrence';
import { RecurringItemType } from '@/types/finance/recurring';
import { createExpense } from '../services/expensesService';
import InputField from '@/components/common/forms/InputField';
import SelectField from '@/components/common/forms/SelectField';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/utils/formatting';
import { useCurrency } from '@/context/CurrencyContext';
import { useCategories } from '@/context/CategoryContext';
import { createRecurringItem } from '@/features/recurring/services/recurringService';
import { AppIcons } from '@/components/icons/AppIcons';

type Props = {
  onAdd: (expense: Expense) => void;
  onRecurringChange?: () => Promise<void>;
};

type ExpenseFormState = {
  name: string;
  description?: string;
  amount: number;
  date: string;
  categoryId: string;
  notes?: string;
  recurrenceFrequency: RecurrenceFrequency;
};

export default function AddExpenseForm({ onAdd, onRecurringChange }: Props) {
  const [form, setForm] = useState<ExpenseFormState>({
    name: '',
    description: '',
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    categoryId: '',
    notes: '',
    recurrenceFrequency: 'None',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isRecurring = form.recurrenceFrequency !== 'None';

  const isFutureDate = (dateStr: string) => {
    const selected = new Date(dateStr);
    const today = new Date();
    selected.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return selected > today;
  };


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
    const { recurrenceFrequency, ...expenseData } = form;
    const skipCreation = isFutureDate(form.date);

    if (!skipCreation) {
      const newExpense = await createExpense(expenseData);
      onAdd(newExpense);
    }

    if (isRecurring) {
      await createRecurringItem({
        name: form.name,
        description: form.description || '',
        amount: form.amount,
        startDate: form.date,
        frequency: recurrenceFrequency,
        type: RecurringItemType.Expense,
        categoryId: form.categoryId || undefined,
        isActive: true,
      });

      if (onRecurringChange) {
        await onRecurringChange();
      }
    }

    toast.success('Expense added successfully!');
    setForm({
      name: '',
      description: '',
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
      categoryId: '',
      notes: '',
      recurrenceFrequency: 'None',
    });
  } catch (err: unknown) {
    toast.error('Failed to add expense');
    setError(err instanceof Error ? err.message : 'Something went wrong');
  } finally {
    setLoading(false);
  }
};


  const { categories } = useCategories();
  const { currency: userCurrency } = useCurrency();

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="lg:w-1/2">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl">
          <div className="grid grid-cols-1 gap-4">
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
              options={categories
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((c) => ({ value: c.id, label: c.name }))}
              placeholder="Select a category"
            />

            <details
              open={showAdvanced}
              className="rounded-xl border border-base-300 bg-base-100"
              onToggle={() => setShowAdvanced(!showAdvanced)}
            >
              <summary className="flex items-center justify-between cursor-pointer p-2 font-medium">
                Advanced Options
                {showAdvanced ? (
                  <AppIcons.up className="w-4 h-4 text-base-content/60" />
                ) : (
                  <AppIcons.down className="w-4 h-4 text-base-content/60" />
                )}
              </summary>

              <div className="space-y-3 mt-2 px-2 pb-4">
                <InputField
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
                <SelectField
                  name="recurrenceFrequency"
                  value={form.recurrenceFrequency}
                  onChange={handleChange}
                  options={[...RecurrenceFrequencyOptions]}
                />
                <InputField
                  name="description"
                  type="text"
                  placeholder="Description"
                  value={form.description || ''}
                  onChange={handleChange}
                />
              </div>
            </details>

            {error && <p className="text-error">{error}</p>}

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Saving...' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>

      <div className="lg:w-1/2 bg-base-200 rounded-xl p-4 border border-dashed border-base-300 text-center text-base-content/50">
        <p>💡 You could add something here...</p>
      </div>
    </div>
  );
}
