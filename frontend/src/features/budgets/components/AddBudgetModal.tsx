import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import InputField from '@/components/common/forms/InputField';
import SelectField from '@/components/common/forms/SelectField';
import { BudgetTypeEnum } from '@/types/finance/budget';
import { RecurrenceFrequency, RecurrenceFrequencyOptions } from '@/types/shared/recurrence';
import { useCategories } from '@/context/CategoryContext';
import { useCreateBudget } from '../services/budgetsService';
import toast from 'react-hot-toast';

type Props = {
  onClose: () => void;
};

export default function AddBudgetModal({ onClose }: Props) {
  const { t } = useTranslation();
  const { categories } = useCategories();
  const { mutate: createBudget } = useCreateBudget();

  const [form, setForm] = useState({
    name: '',
    categoryId: '',
    allocatedAmount: '',
    recurrence: 'Monthly' as RecurrenceFrequency,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    type: BudgetTypeEnum.Spending,
    notes: '',
    isActive: true,
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
      toast.error(t('budgets.toast.invalidForm'));
      return;
    }

    createBudget(
      {
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
          toast.success(t('budgets.toast.createSuccess'));
          onClose();
        },
        onError: () => {
          toast.error(t('budgets.toast.createError'));
        },
      }
    );
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-base-content/30 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-base-100 p-6 rounded-xl shadow-xl w-full max-w-lg relative">
        <button
          className="btn btn-sm btn-circle absolute top-2 right-2"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">{t('budgets.addTitle')}</h2>

        <div className="space-y-3">
          <InputField
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder={t('budgets.form.namePlaceholder')}
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
            placeholder={t('budgets.form.selectCategoryPlaceholder')}
            required
          />
          <InputField
            name="allocatedAmount"
            type="number"
            value={form.allocatedAmount}
            onChange={handleChange}
            placeholder={t('budgets.form.amountPlaceholder')}
            showCurrency
            required
          />
          <SelectField
            name="recurrence"
            value={form.recurrence}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                recurrence: e.target.value as RecurrenceFrequency,
              }));
            }}
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
            placeholder={t('budgets.form.startDatePlaceholder')}
          />
          <InputField
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={handleChange}
            placeholder={t('budgets.form.endDatePlaceholder')}
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
            placeholder={t('budgets.form.notesPlaceholder')}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button className="btn btn-ghost" onClick={onClose}>
            {t('shared.cancel')}
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {t('shared.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
