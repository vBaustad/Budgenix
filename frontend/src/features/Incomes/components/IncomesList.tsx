import DataTable from '@/components/common/tables/DataTable';
import { Income } from '@/types/finance/income';
import { formatCurrency, formatDate, truncateText } from '@/utils/formatting';
import { useCurrency } from '@/context/CurrencyContext';
import { Dialog } from '@headlessui/react';
import InputField from '@/components/common/forms/InputField';
import toast from 'react-hot-toast';
import { useCategories } from '@/context/CategoryContext';
import { useState } from 'react';
import { useDeleteIncome, useUpdateIncome } from '../services/incomesService';
import SelectField from '@/components/common/forms/SelectField';
import { useTranslation } from 'react-i18next';

export default function IncomesList({ incomes }: { incomes: Income[] }) {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const minRows = 15;
  const { categories } = useCategories();
  const { mutate: deleteIncome } = useDeleteIncome();
  const { mutate: updateIncome } = useUpdateIncome();

  const [deletePendingId, setDeletePendingId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<Income | null>(null);
  const [editForm, setEditForm] = useState<Partial<Income>>({});

  const openEditModal = (item: Income) => {
    setEditItem(item);
    setEditForm(item);
  };

  const confirmDelete = (id: string) => {
    setDeletePendingId(id);
  };

  const handleDeleteConfirmed = () => {
    if (deletePendingId) {
      deleteIncome(deletePendingId, {
        onSuccess: () => toast.success(t('incomes.toast.deleteSuccess')),
        onError: () => toast.error(t('incomes.toast.deleteError')),
      });
      setDeletePendingId(null);
    }
  };

  const handleDeleteCancelled = () => {
    setDeletePendingId(null);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) : value }));
  };

  const handleEditSubmit = () => {
    if (!editItem) {
      toast.error(t('incomes.toast.noEditItem'));
      return;
    }

    if (!editForm.name || editForm.name.trim() === '') {
      toast.error(t('incomes.toast.missingName'));
      return;
    }

    if (editForm.amount === undefined || isNaN(editForm.amount)) {
      toast.error(t('incomes.toast.invalidAmount'));
      return;
    }

    if (!editForm.categoryId) {
      toast.error(t('incomes.toast.missingCategory'));
      return;
    }

    updateIncome(
      {
        id: editItem.id,
        data: {
          name: editForm.name,
          description: editForm.description ?? '',
          amount: editForm.amount,
          date: editForm.date ?? editItem.date,
          categoryId: editForm.categoryId,
          notes: editForm.notes ?? null,
        },
      },
      {
        onSuccess: () => {
          toast.success(t('incomes.toast.updateSuccess'));
          setEditItem(null);
        },
        onError: () => toast.error(t('incomes.toast.updateError')),
      }
    );
  };

  const paddedIncomes = [...incomes];
  while (paddedIncomes.length < minRows) {
    paddedIncomes.push({
      id: `placeholder-${paddedIncomes.length}`,
      name: '',
      description: '',
      amount: 0,
      date: '',
      categoryName: '',
      categoryId: '',
      notes: null,
    });
  }

  return (
    <>
      <DataTable
        rowKey="id"
        data={paddedIncomes}
        columns={[
          {
            label: t('shared.date'),
            accessor: 'date',
            format: formatDate,
            width: 'w-[80px]',
            sortable: true,
          },
          {
            label: t('shared.name'),
            accessor: 'name',
            width: 'w-[120px] sm:w-[130px] lg:w-[200px]',
            sortable: true,
          },
          {
            label: t('shared.description'),
            accessor: 'description',
            format: truncateText,
            width: 'w-[150px] sm:w-[180px] lg:w-[240px]',
            sortable: true,
            showOnMobile: false,
          },
          {
            label: t('shared.amount'),
            accessor: 'amount',
            align: 'right',
            format: (val) => formatCurrency(val, currency),
            width: 'w-[80px] sm:w-[100px]',
            sortable: true,
          },
          {
            label: t('shared.category'),
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
          onDelete: (row) => confirmDelete(row.id),
        }}
      />

      {/* Delete Dialog */}
      <Dialog open={!!deletePendingId} onClose={handleDeleteCancelled} className="fixed z-50 inset-0 flex items-center justify-center">
        <div className="fixed inset-0 bg-black opacity-30" />
        <div className="relative bg-base-100 rounded-lg p-6 shadow-lg">
          <Dialog.Title className="text-lg font-semibold">{t('shared.confirmDelete')}</Dialog.Title>
          <Dialog.Description className="mt-2">{t('incomes.confirmDeleteMessage')}</Dialog.Description>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={handleDeleteCancelled} className="btn btn-ghost">{t('shared.cancel')}</button>
            <button onClick={handleDeleteConfirmed} className="btn btn-error">{t('shared.delete')}</button>
          </div>
        </div>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onClose={() => setEditItem(null)} className="fixed z-50 inset-0 flex items-center justify-center">
        <div className="fixed inset-0 bg-black opacity-30" />
        <div className="relative bg-base-100 rounded-lg p-6 shadow-lg w-full max-w-md">
          <Dialog.Title className="text-lg font-semibold">{t('incomes.editTitle')}</Dialog.Title>
          <div className="space-y-3 mt-4">
            <InputField
              name="name"
              value={editForm.name ?? ''}
              onChange={handleEditChange}
              placeholder={t('shared.name')}
            />
            <InputField
              name="amount"
              type="number"
              value={editForm.amount?.toString() ?? ''}
              onChange={handleEditChange}
              placeholder={t('shared.amount')}
              showCurrency
            />
            <InputField
              name="description"
              value={editForm.description ?? ''}
              onChange={handleEditChange}
              placeholder={t('shared.description')}
            />
            <SelectField
              name="categoryId"
              value={editForm.categoryId ?? ''}
              onChange={(e) => handleEditChange(e as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)}
              options={categories.map(c => ({ value: c.id, label: c.name }))}
              placeholder={t('shared.selectCategory')}
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
