import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import toast from 'react-hot-toast';
import { useCashflowContext } from '@/features/cashflows/context/CashflowContext';
import { CashflowItem } from '@/types/finance/cashflow';
import { CashflowModal } from '@/features/cashflows/components/cashflowModal';
import { EditCashflowModal } from '@/features/cashflows/components/editCashflowModal';
import { CashflowOverview } from '@/features/cashflows/components/cashflowOverview';
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog';
import DataTable from '@/components/common/tables/DataTable';
import { AppIcons } from '@/components/icons/AppIcons';
import { normalizeMonthly } from '@/types/shared/normalize';
import { formatCurrency } from '@/utils/formatting';
import { useCurrency } from '@/context/CurrencyContext';

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
  const { currency: userCurrency } = useCurrency();
  const totalIncome = cashflowSummary?.monthlyIncome ?? 0;
  const netMonthly = cashflowSummary?.monthlyBalance ?? 0;
  const annualIncome = cashflowSummary?.annualIncome ?? 0;
  const annualLeftover = cashflowSummary?.annualBalance ?? 0;
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

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

const toggleExpand = (categoryId: string) => {
  setExpandedCategories(prev => {
    const newSet = new Set(prev);
    if (newSet.has(categoryId)) {
      newSet.delete(categoryId);
    } else {
      newSet.add(categoryId);
    }
    return newSet;
  });
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
    <div className="flex min-h-screen bg-base-100 text-base-content p-6">
      <div className="w-full mx-auto">
        <CashflowOverview
          monthlyIncome={totalIncome}
          monthlyLeftover={netMonthly}
          annualLeftover={annualLeftover}
          annualIncome={annualIncome}
          loading={false}
        />
        <div className="grid grid-cols-1 gap-6">
          {/* Tables & Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Expenses Table */}
            <div className="flex flex-col h-[400px] bg-base-100 border border-base-300">
              <div className="flex-1 overflow-auto">
                <DataTable
                  columns={getCashflowColumns(t)}
                  data={expenses}
                  rowKey="id"
                  actionHandlers={{ onEdit: openEditModal, onDelete: row => confirmDelete(row.id) }}
                />
              </div>
              <div className="flex-shrink-0 border-t border-base-300 px-4 py-3 font-semibold flex justify-between">
                <span>{t('cashflow.table.total')}</span>
                <span className="text-error">{expenses.reduce((sum, i) => sum + i.amount, 0).toLocaleString()} kr</span>
              </div>
            </div>

            {/* Income Table */}
            <div className="flex flex-col h-[400px] bg-base-100 border border-base-300">
              <div className="flex-1 overflow-auto">
                <DataTable
                  columns={getCashflowColumns(t, userCurrency)}
                  data={income}
                  rowKey="id"
                  actionHandlers={{ onEdit: openEditModal, onDelete: row => confirmDelete(row.id) }}
                />
              </div>
              <div className="flex-shrink-0 border-t border-base-300 px-4 py-3 font-semibold flex justify-between">
                <span>{t('cashflow.table.total')}</span>
                <span className="text-success">{income.reduce((sum, i) => sum + i.amount, 0).toLocaleString()} kr</span>
              </div>
            </div>

            {/* Action Buttons */}
            <button onClick={openExpenseModal} className="btn btn-primary rounded w-full">
              {t('buttons.addExpense')}
            </button>
            <button onClick={openIncomeModal} className="btn btn-primary rounded w-full">
              {t('buttons.addIncome')}
            </button>
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
        {/* Breakdown */}
        <div className="bg-base-100 border border-base-300 rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 items-start">
            {['Income', 'Expense'].map((type) => {
              const isIncome = type === 'Income';
              const items = categoryBreakdown.filter(i => i.type === type);
              const color = isIncome ? 'success' : 'error';

              return (
                <div key={type}>
                  <div className={`flex items-center gap-2 mb-4 text-${color}`}>
                    {isIncome ? (
                      <AppIcons.income className="w-5 h-5 text-success" />
                    ) : (
                      <AppIcons.expenses className="w-5 h-5 text-error" />
                    )}
                    <h4 className={`text-lg font-bold text-${color}`}>
                      {t(`cashflow.categoryBreakdown.${type}`)}
                    </h4>
                  </div>

                  {items.length === 0 ? (
                    <p className="text-sm text-base-content/60">{t('shared.noData')}</p>
                  ) : (
                    <ul className="space-y-3">
                      {items.map((item, idx) => {
                        const categoryId = item.categoryId || '__uncategorized__';
                        const expanded = expandedCategories.has(categoryId);
                        const toggle = () => toggleExpand(categoryId);

                        const filteredItems = cashflowItems.filter(
                          i => (i.categoryId || '__uncategorized__') === categoryId && i.type === type
                        );

                        return (
                          <li
                            key={idx}
                            className={`bg-${color}/5 rounded-md border border-${color}/20 transition overflow-hidden`}
                          >
                            <button
                              onClick={toggle}
                              className="w-full flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-base-200 transition-all duration-200"
                            >
                              <span className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`}>
                                <AppIcons.up className="w-4 h-4" />
                              </span>
                              <span className="text-sm font-medium text-base-content text-left">
                                {item.categoryName ?? t('shared.uncategorized')}
                              </span>
                              <span className={`text-sm text-${color} font-semibold text-right`}>
                                {formatCurrency(item.monthlyTotal, userCurrency)} / {t('cashflow.perMonth')}
                                <br />
                                <span className="text-xs text-base-content/60">
                                  ({formatCurrency(item.annualTotal, userCurrency)} / {t('cashflow.perYear')})
                                </span>
                              </span>
                            </button>

                            {expanded && (
                              <div className="bg-base-100 border-t border-base-300 px-4 py-3 text-sm animate-fade-in space-y-2">
                                {filteredItems.length > 0 ? (
                                  filteredItems.map((entry, index) => {
                                    const monthly = normalizeMonthly(entry.amount, entry.frequency);
                                    const annual = monthly * 12;

                                    return (
                                      <div
                                        key={entry.id}
                                        className={`flex justify-between text-base-content/80 py-2 ${
                                          index !== filteredItems.length - 1 ? 'border-b border-base-300' : ''
                                        }`}
                                      >
                                        <span>{entry.name}</span>
                                        <span className="text-xs text-right">
                                          {formatCurrency(monthly, userCurrency)} / {t('cashflow.perMonth')}
                                          <br />
                                          <span className="text-base-content/60">
                                            ({formatCurrency(annual, userCurrency)} / {t('cashflow.perYear')})
                                          </span>
                                        </span>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <div className="text-xs text-base-content/60">
                                    {t('shared.noData')}
                                  </div>
                                )}
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Insights */}
        <div className="space-y-6">
          {cashflowInsights.length > 0 && (
            <ul className="space-y-3">
              {cashflowInsights.map((insight, idx) => (
                <li
                  key={idx}
                  className="border-l-4 bg-base-100 border border-info rounded hover:shadow-md transition p-4"
                >
                  <div className="flex items-center gap-2 font-semibold text-info">
                    <span>{insight.icon ?? '💡'}</span>
                    <span>{insight.title}</span>
                  </div>
                  <p className="text-sm text-base-content/70 mt-1">{insight.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-sm text-right text-base-content/70 mt-6 space-y-1">
        <div>
          📋 {t('cashflow.insights.totalEntries')} <strong>{cashflowItems.length}</strong>
        </div>
        <div>
          📆 {t('cashflow.insights.averageMonthly')}{' '}
          <span className="text-primary font-semibold">{netMonthly.toLocaleString()} kr</span>
        </div>
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
// Column Definitions
// --------------------------
function getCashflowColumns(t: TFunction, currency?: string): Column<CashflowItem>[] {
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
      label: t('cashflow.table.category'),
      accessor: 'categoryName',
      width: 'w-[140px]',
      showOnMobile: false,
      sortable: true,      
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
        return <span className={className}>{formatCurrency(value, currency)}</span>;
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
