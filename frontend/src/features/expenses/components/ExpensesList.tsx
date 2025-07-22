'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';

import { Expense } from '@/types/finance/expense';
import { useDeleteExpense, useUpdateExpense } from '../services/expensesService';
import DataTable from '@/components/common/tables/DataTable';
import InputField from '@/components/common/forms/InputField';
import SelectField from '@/components/common/forms/SelectField';

import { formatCurrency, formatDate, truncateText } from '@/utils/formatting';
import { useCurrency } from '@/context/CurrencyContext';
import { useCategories } from '@/context/CategoryContext';
import { useTranslation } from 'react-i18next';

export default function ExpensesList({ expenses }: { expenses: Expense[] }) {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const { categories } = useCategories();
  const { mutate: deleteExpense } = useDeleteExpense();
  const { mutate: updateExpense } = useUpdateExpense();

  const minRows = 15;

  const [deletePendingExpense, setDeletePendingExpense] = useState<{ id: string; date: string } | null>(null);
  const [editItem, setEditItem] = useState<Expense | null>(null);
  const [editForm, setEditForm] = useState<Partial<Expense>>({});

  const openEditModal = (item: Expense) => {
    setEditItem(item);
    setEditForm(item);
  };

  const confirmDelete = (expense: Expense) => {
    setDeletePendingExpense({ id: expense.id, date: expense.date });
  };

  const handleDeleteConfirmed = () => {
    if (!deletePendingExpense) return;
    deleteExpense(deletePendingExpense, {
      onSuccess: () => toast.success(t('expenses.toast.deleteSuccess')),
      onError: () => toast.error(t('expenses.toast.deleteError')),
    });
    setDeletePendingExpense(null);
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

  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const paddedExpenses = [...sortedExpenses];
  while (paddedExpenses.length < minRows) {
    paddedExpenses.push({
      id: `placeholder-${paddedExpenses.length}`,
      name: '',
      description: '',
      amount: 0,
      date: '',
      categoryId: '',
      categoryName: '',
      notes: null,
    });
  }

  return (
    <>
      <DataTable
        rowKey="id"
        data={paddedExpenses}
        columns={[
          {
            label: t('expenses.table.date'),
            accessor: 'date',
            format: formatDate,
            width: 'w-[80px]',
            sortable: true,
          },
          {
            label: t('expenses.table.name'),
            accessor: 'name',
            width: 'w-[120px] sm:w-[130px] lg:w-[200px]',
            sortable: true,
          },
          {
            label: t('expenses.table.description'),
            accessor: 'description',
            format: (val) => truncateText(val),
            width: 'w-[150px] sm:w-[180px] lg:w-[240px]',
            sortable: true,
            showOnMobile: false,
          },
          {
            label: t('expenses.table.amount'),
            accessor: 'amount',
            align: 'right',
            format: (val) => formatCurrency(val, currency),
            width: 'w-[80px] sm:w-[100px]',
            sortable: true,
          },
          {
            label: t('expenses.table.category'),
            accessor: 'categoryName',
            align: 'center',
            format: (val) =>
              val ? (
                <span className="badge badge-sm badge-accent">{val}</span>
              ) : (
                <span className="text-base-content/40">–</span>
              ),
            width: 'w-[100px] sm:w-[150px]',
            sortable: true,
            showOnMobile: false,
          },
        ]}
        actionHandlers={{
          onEdit: openEditModal,
          onDelete: (row) => confirmDelete(row),
        }}
      />

      {/* Delete confirmation dialog */}
      <Dialog open={!!deletePendingExpense} onClose={() => setDeletePendingExpense(null)} className="fixed z-50 inset-0 flex items-center justify-center">
        <div className="fixed inset-0 bg-black opacity-30" />
        <div className="relative bg-base-100 rounded-lg p-6 shadow-lg">
          <Dialog.Title className="text-lg font-semibold">{t('shared.confirmDelete')}</Dialog.Title>
          <Dialog.Description className="mt-2">{t('expenses.confirmDeleteText')}</Dialog.Description>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setDeletePendingExpense(null)} className="btn btn-ghost">{t('shared.cancel')}</button>
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
