import { useState } from 'react';
import { RecurrenceFrequencyOptions } from '../../../types/shared/recurrence';
import { RecurringExpenseDto } from '../../../types/finance/recurring';
import { deleteRecurringItem, updateRecurringItem } from '../../../services/app/recurringService';
import InputField from '../../../components/common/forms/InputField';
import SelectField from '../../../components/common/forms/SelectField';
import toast from 'react-hot-toast';


type Props = {
  item: RecurringExpenseDto;
  onSave: () => void;
  onCancel: () => void;
};

type RecurringForm = RecurringExpenseDto & {
  recurrenceFrequency: string;
  endDate?: string;
  isActive: boolean;
};


export default function EditRecurringItemForm({ item, onSave, onCancel }: Props) {
  const [form, setForm] = useState<RecurringForm>({
    ...item,
    recurrenceFrequency: item.frequency,
    endDate: item.endDate ?? '',
    isActive: true, // or item.isActive if available
    });

  const [loading, setLoading] = useState(false);

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value, type } = e.target;

  const inputValue =
    type === 'checkbox'
      ? (e.target as HTMLInputElement).checked
      : value;

  setForm(prev => ({
    ...prev,
    [name]: inputValue,
  }));
};

const handleDelete = async () => {
  // if (!confirm('Are you sure you want to delete this item?')) return;

  try {
    setLoading(true);
    await deleteRecurringItem(form.id);
    toast.success('Item deleted');
    onSave();
  } catch (err: unknown) {
    if (err instanceof Error) {
      toast.error(`Delete failed: ${err.message}`);
    } else {
      toast.error('Delete failed: Unknown error');
    }
  } finally {
    setLoading(false);
  }
};


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
  await updateRecurringItem(form); 
  toast.success('Recurring item updated');
  onSave(); 
  } catch (err: unknown) {
    if (err instanceof Error) {
    toast.error('Failed to update item');
    } else {
      toast.error('Update failed: Unknown error');
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="bg-base-100 p-4 rounded-xl border shadow space-y-4">
      <h3 className="text-lg font-semibold text-primary">Edit Recurring</h3>

      <InputField name="name" value={form.name} onChange={handleChange} placeholder="Name" />
      <InputField name="amount" type="number" value={form.amount.toString()} onChange={handleChange} placeholder="Amount" />
      <InputField name="startDate" type="date" value={form.startDate.slice(0, 10)} onChange={handleChange} placeholder="Start Date" />
      <SelectField
        name="recurrenceFrequency"
        label="Frequency"
        value={form.recurrenceFrequency}
        onChange={handleChange}
        options={[...RecurrenceFrequencyOptions]}
        />
      <InputField name="endDate" type="date" value={form.endDate?.slice(0, 10) || ''} onChange={handleChange} placeholder="End Date (optional)" />
      <div className="flex items-center gap-2">
        <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
        <label className="text-sm">Active</label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button type="button" className="btn btn-outline btn-sm" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className="btn btn-error btn-sm" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </form>
  );
}
