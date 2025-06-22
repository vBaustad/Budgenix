import { useState } from 'react';
import { RecurrenceFrequencyOptions } from '@/types/shared/recurrence';
import { RecurringItemDto, UpdateRecurringItemDto } from '@/types/finance/recurring';
import { useUpdateRecurringItem, useDeleteRecurringItem } from '../services/recurringService';
import InputField from '@/components/common/forms/InputField';
import SelectField from '@/components/common/forms/SelectField';

type Props = {
  item: RecurringItemDto;
  onSave: () => void;
  onCancel: () => void;
};

type RecurringForm = UpdateRecurringItemDto; // simplify: match the shape we need to send!

export default function EditRecurringItemForm({ item, onSave, onCancel }: Props) {
  const [form, setForm] = useState<RecurringForm>({
    name: item.name,
    description: item.description ?? '',
    amount: item.amount,
    startDate: item.startDate,
    endDate: item.endDate,
    frequency: item.frequency,
    isActive: item.isActive,
    type: item.type,
    categoryId: item.categoryId,
  });

  const { mutate: deleteItem, isPending: isDeleting } = useDeleteRecurringItem();
  const { mutate: updateItem, isPending: isSaving } = useUpdateRecurringItem();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const inputValue =
      type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : type === 'number'
        ? parseFloat(value)
        : value;

    setForm((prev) => ({
      ...prev,
      [name]: inputValue,
    }));
  };

  const handleDelete = () => {
    deleteItem(item.id, {
      onSuccess: onSave,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateItem(
      {
        id: item.id,
        data: form,
      },
      {
        onSuccess: onSave,
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-base-100 p-4 rounded-xl border shadow space-y-4 w-full max-w-full overflow-hidden"
    >
      <h3 className="text-lg font-semibold text-primary">Edit Recurring</h3>

      <InputField name="name" value={form.name} onChange={handleChange} placeholder="Name" />
      <InputField
        name="amount"
        type="number"
        value={form.amount.toString()}
        onChange={handleChange}
        showCurrency={true}
      />
      <InputField
        name="description"
        value={form.description ?? ''}
        onChange={handleChange}
        placeholder="Description"
      />
      <SelectField
        name="frequency"
        value={form.frequency}
        onChange={handleChange}
        options={[...RecurrenceFrequencyOptions]}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isActive"
          checked={form.isActive}
          onChange={handleChange}
        />
        <label className="text-sm">Active</label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="submit"
          className="btn btn-primary btn-sm"
          disabled={isSaving || isDeleting}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-error btn-sm"
          onClick={handleDelete}
          disabled={isSaving || isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </form>
  );
}
