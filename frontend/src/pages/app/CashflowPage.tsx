import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import toast from 'react-hot-toast';

import { useCashflowContext } from '@/features/cashflows/context/CashflowContext';
import { CashflowItem } from '@/types/finance/cashflow';

import { CashflowModal } from '@/features/cashflows/components/cashflowModal';
import { EditCashflowModal } from '@/features/cashflows/components/editCashflowModal';
import { SummaryCard } from '@/features/cashflows/components/cashflowSummaryCard';
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog';
import DataTable from '@/components/common/tables/DataTable';

export type Column<T> = {
  label: string;
  accessor: keyof T;
  format?: (value: T[keyof T], row?: T) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
  width?: string;
  sortable?: boolean;
  showOnMobile?: boolean;
};

export default function CashflowPage() {
  const { t } = useTranslation();
  const [modalType, setModalType] = useState<'income' | 'expense' | null>(null);
  const [editItem, setEditItem] = useState<CashflowItem | null>(null);
  const [editForm, setEditForm] = useState<Partial<CashflowItem> & { categoryId?: string }>({});
  const [deletePendingId, setDeletePendingId] = useState<string | null>(null);

  const {
    cashflowItems,
    deleteItem,
    updateItem,
    cashflowSummary,
    cashflowInsights
  } = useCashflowContext();

  const categoryBreakdown = cashflowSummary?.categoryBreakdown ?? [];


  const income = useMemo(() => cashflowItems.filter(i => i.type === 'Income'), [cashflowItems]);
  const expenses = useMemo(() => cashflowItems.filter(i => i.type === 'Expense'), [cashflowItems]);

  const totalIncome = cashflowSummary?.monthlyIncome ?? 0;
  const netMonthly = cashflowSummary?.monthlyBalance ?? 0;
  const netAnnual = cashflowSummary?.annualBalance ?? 0;

  const openIncomeModal = () => setModalType('income');
  const openExpenseModal = () => setModalType('expense');
  const closeModal = () => setModalType(null);

  const openEditModal = (item: CashflowItem) => {
    setEditItem(item);
    setEditForm(item);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'monthlyAmount' ? parseFloat(value) : value,
    }));
  };

  const handleEditSubmit = () => {
    if (!editItem || !editForm.name?.trim() || isNaN(editForm.amount!) || !editForm.frequency) {
      toast.error(t('cashflow.toast.invalidForm'));
      return;
    }

    updateItem(
      {
        id: editItem.id,
        data: {
          name: editForm.name.trim(),
          amount: editForm.amount!,
          frequency: editForm.frequency!,
          type: editItem.type,
          person: editForm.person,
          categoryId: editForm.categoryId,
        },
      },
      {
        onSuccess: () => {
          toast.success(t('cashflow.toast.updateSuccess'));
          setEditItem(null);
        },
        onError: () => toast.error(t('cashflow.toast.updateError')),
      }
    );
  };

  const confirmDelete = (id: string) => setDeletePendingId(id);
  const handleDeleteConfirmed = () => {
    if (!deletePendingId) return;
    deleteItem(deletePendingId, {
      onSuccess: () => toast.success(t('cashflow.toast.deleteSuccess')),
      onError: () => toast.error(t('cashflow.toast.deleteError')),
    });
    setDeletePendingId(null);
  };
  const cancelDelete = () => setDeletePendingId(null);

  return (
    <div className="flex min-h-screen bg-base-200 text-base-content p-6">
      <div className="w-full mx-auto max-w-7xl">

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <SummaryCard label={t('cashflow.monthlyIncome')} value={totalIncome} icon="💼" />
          <SummaryCard label={t('cashflow.annualIncome')} value={cashflowSummary?.annualIncome ?? 0} icon="📈" />
          <SummaryCard label={t('cashflow.monthlyLeftover')} value={netMonthly} icon="📊" highlight />
          <SummaryCard label={t('cashflow.annualLeftover')} value={netAnnual} icon="📅" />
        </div>

        {/* Category Breakdown */}
        {categoryBreakdown.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">{t('cashflow.categoryBreakdown.title')}</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-base-300 bg-base-100 p-4 rounded shadow-sm space-y-1"
                >
                  <div className="font-medium">
                    {item.categoryId ? (
                      <span>{item.categoryId}</span>
                    ) : (
                      <span className="italic text-base-content/60">{t('cashflow.unknownCategory')}</span>
                    )}
                  </div>
                  <div className="text-sm text-base-content/70">
                    {t('cashflow.categoryBreakdown.' + item.type)}:
                  </div>
                  <div className="text-sm">
                    <strong>{item.monthlyTotal.toLocaleString()} kr</strong> / {t('cashflow.perMonth')}
                  </div>
                  <div className="text-sm">
                    <strong>{item.annualTotal.toLocaleString()} kr</strong> / {t('cashflow.perYear')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Insights */}
        {cashflowInsights.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">{t('cashflow.insights.title')}</h3>
            <ul className="space-y-3">
              {cashflowInsights.map((insight, idx) => (
                <li key={idx} className="bg-base-200 border-l-4 border-info p-4 rounded shadow-sm">
                  <div className="flex items-center gap-2 mb-1 font-medium text-base-content">
                    <span>{insight.icon ?? '💡'}</span>
                    <span>{insight.title}</span>
                  </div>
                  <p className="text-sm text-base-content/80">{insight.message}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Cashflow Tables */}
        <div className="grid gap-6 border border-base-200 rounded-lg p-4 bg-base-100 shadow-sm">
          <SectionHeader
            title={t('cashflow.income')}
            buttonLabel={t('buttons.addIncome')}
            onAddClick={openIncomeModal}
          />
          <DataTable
            columns={getCashflowColumns(t)}
            data={income}
            rowKey="id"
            actionHandlers={{ onEdit: openEditModal, onDelete: row => confirmDelete(row.id) }}
            footer={
              <tr className="font-semibold border-t border-base-300">
                <td colSpan={3}>{t('cashflow.table.total')}</td>
                <td className="text-success">{income.reduce((sum, i) => sum + i.amount, 0).toLocaleString()} kr</td>
              </tr>
            }
          />


          <SectionHeader
            title={t('cashflow.expenses')}
            buttonLabel={t('buttons.addExpense')}
            onAddClick={openExpenseModal}
            className="pt-8"
          />
          <DataTable
            columns={getCashflowColumns(t)}
            data={expenses}
            rowKey="id"
            actionHandlers={{ onEdit: openEditModal, onDelete: row => confirmDelete(row.id) }}
            footer={
              <tr className="font-semibold border-t border-base-300">
                <td colSpan={3}>{t('cashflow.table.total')}</td>
                <td className="text-error">{expenses.reduce((sum, i) => sum + i.amount, 0).toLocaleString()} kr</td>

              </tr>
            }
          />

        </div>

        {/* Footer Note */}
        <div className="text-sm text-right text-base-content/70 mt-6">
          {t('cashflow.insights.totalEntries', { count: cashflowItems.length })}
          <br />
          {t('cashflow.insights.averageMonthly', { value: netMonthly.toLocaleString() })}
        </div>

        {/* Modals */}
        {modalType && <CashflowModal type={modalType} onClose={closeModal} />}
        {editItem && (
          <EditCashflowModal
            open
            item={editForm}
            onChange={handleEditChange}
            onClose={() => setEditItem(null)}
            onSubmit={handleEditSubmit}
          />
        )}
        {deletePendingId && (
          <ConfirmDeleteDialog
            open
            title={t('shared.confirmDelete')}
            description={t('cashflow.confirmDeleteMessage')}
            confirmLabel={t('buttons.delete')}
            cancelLabel={t('buttons.cancel')}
            onCancel={cancelDelete}
            onConfirm={handleDeleteConfirmed}
          />
        )}
      </div>
    </div>
  );
}

// --------------------------
// Section Header
// --------------------------
function SectionHeader({
  title,
  className = '',
  buttonLabel,
  onAddClick,
}: {
  title: string;
  className?: string;
  buttonLabel?: string;
  onAddClick?: () => void;
}) {
  return (
    <div className={`flex justify-between items-center ${className}`}>
      <h2 className="text-md font-semibold">{title}</h2>
      {buttonLabel && onAddClick && (
        <button className="btn btn-sm btn-primary" onClick={onAddClick}>
          {buttonLabel}
        </button>
      )}
    </div>
  );
}

// --------------------------
// Column Definitions
// --------------------------
function getCashflowColumns(t: TFunction): Column<CashflowItem>[] {
  return [
    {
      label: t('cashflow.table.name'),
      accessor: 'name',
      width: 'w-[100px]',
      sortable: true,
    },
    {
      label: t('cashflow.table.person'),
      accessor: 'person',
      width: 'w-[140px]',
      showOnMobile: false,
      sortable: true,
      format: val => (typeof val === 'string' && val.trim() !== '' ? val : t('cashflow.unknownPerson')),
    },
    {
      label: t('cashflow.table.frequency'),
      accessor: 'frequency',
      width: 'w-[100px]',
      sortable: true,
      format: val => (
        <span className={`badge badge-sm capitalize badge-${frequencyToColor(val as string)}`}>
          {t(`cashflow.frequency.${val}`)}
        </span>
      ),
    },
    {
      label: t('cashflow.table.amount'),
      accessor: 'amount',
      sortable: true,
      width: 'w-[100px]',
      format: (val, row) => {
        const value = val as number;
        const className = row?.type === 'Expense' ? 'text-error' : 'text-success';
        return <span className={className}>{value.toLocaleString()} kr</span>;
      },
    },
  ];
}

function frequencyToColor(freq: string) {
  switch (freq) {
    case 'Daily': return 'info';
    case 'Weekly': return 'success';
    case 'Monthly': return 'primary';
    case 'Yearly': return 'accent';
    default: return 'neutral';
  }
}
