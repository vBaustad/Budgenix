import DataTable from '../../../components/common/tables/DataTable';
import { Expense } from '../../../types/finance/expense';
import { formatCurrency, formatDate, truncateText } from '../../../utils/formatting';
import { useCurrency } from '../../../context/CurrencyContext';
import toast from 'react-hot-toast';
import { useDeleteExpense, useUpdateExpense } from '../services/expensesService';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import InputField from '@/components/common/forms/InputField';
import { useCategories } from '@/context/CategoryContext';
import SelectField from '@/components/common/forms/SelectField';

export default function ExpensesList({ expenses }: { expenses: Expense[] }) {
  const { currency } = useCurrency();
  const minRows = 15;
  const { categories } = useCategories();
  const { mutate: deleteExpense } = useDeleteExpense();
  const { mutate: updateExpense } = useUpdateExpense();

  const [deletePendingId, setDeletePendingId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<Expense | null>(null);
  const [editForm, setEditForm] = useState<Partial<Expense>>({});

  const openEditModal = (item: Expense) => {
    console.log('Opening edit modal for:', item);
    setEditItem(item);
    setEditForm(item);
  };

 const confirmDelete = (id: string) => {
    setDeletePendingId(id);
  };

  const handleDeleteConfirmed = () => {
    if (deletePendingId) {
      deleteExpense(deletePendingId, {
        onSuccess: () => toast.success("Expense deleted"),
        onError: () => toast.error("Failed to delete expense"),
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
    toast.error('No item selected for editing');
    return;
  }

  if (!editForm.name || editForm.name.trim() === '') {
    toast.error('Name is required');
    return;
  }

  if (editForm.amount === undefined || isNaN(editForm.amount)) {
    toast.error('Amount is required and must be a number');
    return;
  }

  if (!editForm.categoryId) {
    toast.error('Category is required');
    return;
  }

  updateExpense(
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
        toast.success('Expense updated');
        setEditItem(null);
      },
      onError: () => toast.error('Failed to update expense'),
    }
  );
};


  const paddedExpenses = [...expenses];
  while (paddedExpenses.length < minRows) {
    paddedExpenses.push({
      id: `placeholder-${paddedExpenses.length}`,
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
        data={paddedExpenses}
        columns={[
            {
              label: 'Date',
              accessor: 'date',
              format: formatDate,
              width: 'w-[80px]',
              sortable: true,
            },
            {
              label: 'Name',
              accessor: 'name',
              width: 'w-[120px] sm:w-[130px] lg:w-[200px]',
              sortable: true,
            },
            {
              label: 'Description',
              accessor: 'description',
              format: truncateText,
              width: 'w-[150px] sm:w-[180px] lg:w-[240px]',
              sortable: true,
              showOnMobile: false,
            },
            {
              label: 'Amount',
              accessor: 'amount',
              align: 'right',
              format: (val) => formatCurrency(val, currency),
              width: 'w-[80px] sm:w-[100px]',
              sortable: true,
            },
            {
              label: 'Category',
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
      <Dialog open={!!deletePendingId} onClose={handleDeleteCancelled} className="fixed z-50 inset-0 flex items-center justify-center">
        <div className="fixed inset-0 bg-black opacity-30" />
        <div className="relative bg-base-100 rounded-lg p-6 shadow-lg">
          <Dialog.Title className="text-lg font-semibold">Confirm Delete</Dialog.Title>
          <Dialog.Description className="mt-2">Are you sure you want to delete this expense?</Dialog.Description>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={handleDeleteCancelled} className="btn btn-ghost">Cancel</button>
            <button onClick={handleDeleteConfirmed} className="btn btn-error">Delete</button>
          </div>
        </div>
      </Dialog>

      {/* Edit popup dialog */}
      <Dialog open={!!editItem} onClose={() => setEditItem(null)} className="fixed z-50 inset-0 flex items-center justify-center">
        <div className="fixed inset-0 bg-black opacity-30" />
        <div className="relative bg-base-100 rounded-lg p-6 shadow-lg w-full max-w-md">
          <Dialog.Title className="text-lg font-semibold">Edit Expense</Dialog.Title>
          <div className="space-y-3 mt-4">
            <InputField
              name="name"
              value={editForm.name ?? ''}
              onChange={handleEditChange}
              placeholder="Name"
            />
            <InputField
              name="amount"
              type="number"
              value={editForm.amount?.toString() ?? ''}
              onChange={handleEditChange}
              placeholder="Amount"
              showCurrency
            />
            <InputField
              name="description"
              value={editForm.description ?? ''}
              onChange={handleEditChange}
              placeholder="Description"
            />
            <SelectField
              name="categoryId"
              value={editForm.categoryId ?? ''}
              onChange={(e) => handleEditChange(e as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)}
              options={categories.map(c => ({ value: c.id, label: c.name }))}
              placeholder="Select category"
            />

          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setEditItem(null)} className="btn btn-ghost">Cancel</button>
            <button onClick={handleEditSubmit} className="btn btn-primary">Save</button>
          </div>
        </div>
      </Dialog>
    </>
  );
}