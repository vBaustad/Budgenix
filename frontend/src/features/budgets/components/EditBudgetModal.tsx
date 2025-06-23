import { useState } from 'react';
import { useDeleteBudget, useUpdateBudget } from '../services/budgetsService';
import { BudgetDto, BudgetTypeEnum } from '@/types/finance/budget';
import { RecurrenceFrequency, RecurrenceFrequencyOptions } from '@/types/shared/recurrence';
import { useCategories } from '@/context/CategoryContext';
import toast from 'react-hot-toast';
import InputField from '@/components/common/forms/InputField';
import SelectField from '@/components/common/forms/SelectField';

export type EditBudgetModalProps = {
  budget: BudgetDto;
  onClose: () => void;
};

export default function EditBudgetModal({ budget, onClose }: EditBudgetModalProps) {
  const { categories } = useCategories();
  const { mutate: updateBudget } = useUpdateBudget();
  const { mutate: deleteBudget } = useDeleteBudget();
  const [deletePending, setDeletePending] = useState(false);
  
  const [form, setForm] = useState({
    name: budget.name,
    categoryId: budget.categoryId,
    allocatedAmount: budget.allocatedAmount.toString(),
    recurrence: budget.recurrence,
    startDate: budget.startDate.split('T')[0],
    endDate: budget.endDate ? budget.endDate.split('T')[0] : '',
    type: budget.type,
    notes: budget.notes || '',
    isActive: budget.isActive,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'allocatedAmount' ? value.replace(/[^\d.]/g, '') : value,
    }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.categoryId || !form.allocatedAmount) {
      toast.error('Please fill in all required fields');
      return;
    }

    updateBudget(
      {
        id: budget.id,
        name: form.name,
        categoryId: form.categoryId,
        allocatedAmount: parseFloat(form.allocatedAmount),
        recurrence: form.recurrence,
        startDate: form.startDate,
        endDate: form.endDate || null,
        type: form.type,
        notes: form.notes || null,
        isActive: form.isActive,
      },
      {
        onSuccess: () => {
          toast.success('Budget updated');
          onClose();
        },
        onError: () => {
          toast.error('Failed to update budget');
        },
      }
    );
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

const handleDelete = () => {
  setDeletePending(true);
};

const handleDeleteConfirmed = () => {
  deleteBudget(budget.id, {
    onSuccess: () => {
      toast.success("Budget deleted");
      setDeletePending(false);
      onClose();
    },
    onError: () => {
      toast.error("Failed to delete budget");
      setDeletePending(false);
    },
  });
};


const handleDeleteCancelled = () => {
  setDeletePending(false);
};

  return (
    <div
      className="fixed inset-0 bg-base-content/30 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-base-100 p-6 rounded-xl shadow-xl w-full max-w-lg relative">
        <button className="btn btn-sm btn-circle absolute top-2 right-2" onClick={onClose}>✕</button>
        <h2 className="text-xl font-bold mb-4">Edit Budget</h2>

        <div className="space-y-3">
          <InputField
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Budget name"
            required
          />
          <SelectField
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            options={categories.map((c) => ({
              value: c.id,
              label: c.name,
            }))}
            placeholder="Select category"
            required
          />
          <InputField
            name="allocatedAmount"
            type="number"
            value={form.allocatedAmount}
            onChange={handleChange}
            placeholder="Allocated amount"
            showCurrency
            required
          />
          <SelectField
            name="recurrence"
            value={form.recurrence}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                recurrence: e.target.value as RecurrenceFrequency,
              }))
            }
            options={RecurrenceFrequencyOptions.map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
            required
          />
          <InputField
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            placeholder="Start date"
          />
          <InputField
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={handleChange}
            placeholder="End date"
          />
          <SelectField
            name="type"
            value={form.type}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                type: e.target.value as BudgetTypeEnum,
              }))
            }
            options={Object.values(BudgetTypeEnum).map((val) => ({
              value: val,
              label: val,
            }))}
            required
          />
          <InputField
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Notes (optional)"
          />
        </div>

        <div className="flex justify-between mt-4">
          <button className="btn btn-error" onClick={handleDelete}>
            Delete
          </button>
          <div className="flex gap-2">
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Update</button>
          </div>
        </div>

        {deletePending && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-base-100 p-4 rounded-xl shadow-xl">
              <p className="mb-4">Are you sure you want to delete this budget? This action cannot be undone.</p>
              <div className="flex gap-2 justify-end">
                <button className="btn btn-ghost" onClick={handleDeleteCancelled}>Cancel</button>
                <button className="btn btn-error" onClick={handleDeleteConfirmed}>Yes, Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
