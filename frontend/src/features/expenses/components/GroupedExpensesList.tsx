import { useState } from 'react';
import { formatCurrency, formatDate, truncateText } from '@/utils/formatting';
import DataTable from '@/components/common/tables/DataTable';
import { useCurrency } from '@/context/CurrencyContext';
import { useTranslation } from 'react-i18next';
import { GroupedExpenses, Expense } from '@/types/finance/expense';
import { Dialog } from '@headlessui/react';
import { useDeleteExpense, useUpdateExpense } from '../services/expensesService';
import InputField from '@/components/common/forms/InputField';
import SelectField from '@/components/common/forms/SelectField';
import { useCategories } from '@/context/CategoryContext';
import toast from 'react-hot-toast';

type Props = {
  data: GroupedExpenses;
  groupBy: 'month' | 'year' | 'category';
};

export default function GroupedExpensesList({ data, groupBy }: Props) {
  const { currency } = useCurrency();
  const { t, i18n } = useTranslation();
  const { categories } = useCategories();
  const { mutate: deleteExpense } = useDeleteExpense();
  const { mutate: updateExpense } = useUpdateExpense();

  const [deletePendingId, setDeletePendingId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<Expense | null>(null);
  const [editForm, setEditForm] = useState<Partial<Expense>>({});

  const openEditModal = (item: Expense) => {
    setEditItem(item);
    setEditForm(item);
  };

  const confirmDelete = (id: string) => setDeletePendingId(id);

  const handleDeleteConfirmed = () => {
    if (!deletePendingId) return;
    deleteExpense(deletePendingId, {
      onSuccess: () => toast.success(t('expenses.toast.deleteSuccess')),
      onError: () => toast.error(t('expenses.toast.deleteError')),
    });
    setDeletePendingId(null);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) : value }));
  };

  const handleEditSubmit = () => {
    if (!editItem || !editForm.name?.trim() || isNaN(editForm.amount!) || !editForm.categoryId) {
      toast.error(t('expenses.toast.invalidForm'));
      return;
    }

    updateExpense(
      {
        id: editItem.id,
        data: {
          name: editForm.name.trim(),
          description: editForm.description ?? '',
          amount: editForm.amount!,
          date: editForm.date ?? editItem.date,
          categoryId: editForm.categoryId,
          notes: editForm.notes ?? null,
        },
      },
      {
        onSuccess: () => {
          toast.success(t('expenses.toast.updateSuccess'));
          setEditItem(null);
        },
        onError: () => toast.error(t('expenses.toast.updateError')),
      }
    );
  };

  const formatGroupLabel = (key: string | undefined): string => {
    if (!key) return t('shared.unknown');

    switch (groupBy) {
      case 'month': {
        const [year, month] = key.split('-');
        const date = new Date(Number(year), Number(month) - 1);
        return date.toLocaleString(i18n.language, { month: 'long', year: 'numeric' });
      }
      case 'year':
        return key;
      case 'category':
        return t(`categories.${key}`, key);
      default:
        return key;
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        {data.map(({ groupName, expenses }) => (
          <div
            key={groupName}
            className="rounded-xl border border-l-4 border-primary bg-base-100 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-base-content mb-2 mt-2 ml-2">
              {formatGroupLabel(groupName)}
            </h3>

            <DataTable
              rowKey="id"
              data={expenses}
              columns={[
                {
                  label: t('shared.date'),
                  accessor: 'date',
                  format: formatDate,
                  width: '100px',
                  sortable: true,
                  showOnMobile: false,
                },
                {
                  label: t('shared.name'),
                  accessor: 'name',
                  width: '150px',
                  sortable: true,
                },
                {
                  label: t('shared.description'),
                  accessor: 'description',
                  format: (val) => truncateText(val),
                  width: '400px',
                  sortable: true,
                },
                {
                  label: t('shared.amount'),
                  accessor: 'amount',
                  align: 'right',
                  format: (val) => formatCurrency(val, currency),
                  width: '100px',
                },
                {
                  label: t('shared.category'),
                  accessor: 'categoryName',
                  format: (val) =>
                    val ? (
                      <span className="badge badge-sm badge-accent">{val}</span>
                    ) : (
                      <span className="text-base-content/40">–</span>
                    ),
                  width: '150px',
                },
              ]}
              actionHandlers={{
                onEdit: openEditModal,
                onDelete: (row) => confirmDelete(row.id),
              }}
            />
          </div>
        ))}
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deletePendingId} onClose={() => setDeletePendingId(null)} className="fixed z-50 inset-0 flex items-center justify-center">
        <div className="fixed inset-0 bg-black opacity-30" />
        <div className="relative bg-base-100 rounded-lg p-6 shadow-lg">
          <Dialog.Title className="text-lg font-semibold">{t('shared.confirmDelete')}</Dialog.Title>
          <Dialog.Description className="mt-2">{t('expenses.confirmDeleteText')}</Dialog.Description>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setDeletePendingId(null)} className="btn btn-ghost">{t('shared.cancel')}</button>
            <button onClick={handleDeleteConfirmed} className="btn btn-error">{t('shared.delete')}</button>
          </div>
        </div>
      </Dialog>

      {/* Edit modal */}
      <Dialog open={!!editItem} onClose={() => setEditItem(null)} className="fixed z-50 inset-0 flex items-center justify-center">
        <div className="fixed inset-0 bg-black opacity-30" />
        <div className="relative bg-base-100 rounded-lg p-6 shadow-lg w-full max-w-md">
          <Dialog.Title className="text-lg font-semibold">{t('expenses.editTitle')}</Dialog.Title>
          <div className="space-y-3 mt-4">
            <InputField name="name" value={editForm.name ?? ''} onChange={handleEditChange} placeholder={t('expenses.form.namePlaceholder')} />
            <InputField name="amount" type="number" value={editForm.amount?.toString() ?? ''} onChange={handleEditChange} placeholder={t('expenses.form.amountPlaceholder')} showCurrency />
            <InputField name="description" value={editForm.description ?? ''} onChange={handleEditChange} placeholder={t('expenses.form.descriptionPlaceholder')} />
            <SelectField
              name="categoryId"
              value={editForm.categoryId ?? ''}
              onChange={(e) => handleEditChange(e as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              placeholder={t('expenses.form.selectCategoryPlaceholder')}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setEditItem(null)} className="btn btn-ghost">{t('shared.cancel')}</button>
            <button onClick={handleEditSubmit} className="btn btn-primary">{t('shared.save')}</button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
