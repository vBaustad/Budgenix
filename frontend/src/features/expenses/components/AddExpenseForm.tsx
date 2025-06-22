import { useState } from 'react';
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
};

type ExpenseFormState = {
  name: string;
  description?: string;
  amount: number;
  date: string;
  categoryId: string;
  notes?: string;
};

export default function AddExpenseForm({ onAdd }: Props) {
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
      toast.success('Expense added successfully!');
      setForm({
        name: '',
        description: '',
        amount: 0,
        date: new Date().toISOString().slice(0, 10),
        categoryId: '',
        notes: '',
      });
    } catch (err: unknown) {
      toast.error('Failed to add expense');
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
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
        <div className="grid grid-cols-2 gap-2">
          <SelectField
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            options={categories
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((c) => ({ value: c.id, label: c.name }))}
            placeholder="Select category"
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
          placeholder="Description"
          value={form.description || ''}
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
