import { useEffect, useState } from 'react';
import { CreateExpenseDto, Expense } from '../../../types/finance/expense';
import { RecurrenceFrequency, RecurrenceFrequencyOptions } from '../../../types/shared/recurrence';
import { createExpense } from '../../../services/app/expensesService';
import { fetchUsedCategories } from '../../../services/app/categoriesService';
import InputField from '../../../components/common/forms/InputField';
import SelectField from '../../../components/common/forms/SelectField';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../../utils/formatting';
import { useCurrency } from '../../../context/CurrencyContext';

type Props = {
  onAdd: (expense: Expense) => void;
  onRecurringChange?: () => Promise<void>; // optional and async
};


type Category = {
  id: string;
  name: string;
};

export default function AddExpenseForm({ onAdd, onRecurringChange }: Props) {
  const [form, setForm] = useState<CreateExpenseDto>({
    name: '',
    description: '',
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    categoryId: '',
    isRecurring: false,
    recurrenceFrequency: 'None' as RecurrenceFrequency,
    notes: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;

      setForm(prev => ({
        ...prev,
        [name]: type === 'checkbox'
          ? checked
          : value,
      }));
    };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const newExpense = await createExpense(form);
      onAdd(newExpense);
      if (form.isRecurring && onRecurringChange) {
        await onRecurringChange();
      }
      toast.success('Expense added successfully!');
      // Reset form
      setForm({
        name: '',
        description: '',
        amount: 0,
        date: new Date().toISOString().slice(0, 10),
        categoryId: '',
        isRecurring: false,
        recurrenceFrequency: 'None' as RecurrenceFrequency,
        notes: '',
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error('Failed to add expense')
        setError(err.message || 'Failed to add expense');
      } else {
        setError('Failed to add expense');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsedCategories()
      .then((data) => {        
        setCategories(data);
      })
      .catch((err) => {
        console.error('Failed to fetch categories', err);
        setCategories([]);
      });
  }, []);

  const { currency: userCurrency } = useCurrency();

  return (
    
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
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
            showCurrency={true}
            required
          />              
          <SelectField
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            options={categories.map(c => ({
              value: c.id,
              label: c.name, 
            }))}
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
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isRecurring"
            checked={form.isRecurring}
            onChange={handleChange}
          />
          <label className="label-text">Recurring</label>
        </div>
        {form.isRecurring && (
          <SelectField
            name="recurrenceFrequency"
            label="Frequency"
            value={form.recurrenceFrequency.toString()}
            onChange={handleChange}
            options={[...RecurrenceFrequencyOptions]}          
          />

        )}
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
