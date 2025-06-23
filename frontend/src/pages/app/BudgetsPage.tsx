import { useBudgets } from '@/features/budgets/context/BudgetsContext';
import { useTranslation } from 'react-i18next';
import BudgetGrid from '@/features/budgets/components/BudgetGrid';
import { useState } from 'react';
import AddBudgetModal from '@/features/budgets/components/AddBudgetModal';
import BudgetOverview from '@/features/budgets/components/BudgetsOverview';
import EditBudgetModal from '@/features/budgets/components/EditBudgetModal';
import { useBudgetById } from '@/features/budgets/services/budgetsService';

export default function BudgetsPage() {
  const { t } = useTranslation();
  const { budgets, isLoading, editTargetId, closeEditModal } = useBudgets();
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  const { data: selectedBudget, isLoading: isLoadingBudget } = useBudgetById(editTargetId ?? '', {
    enabled: !!editTargetId,
  });

  return (
    <div className="min-h-screen p-6 relative">
      {isLoading ? (
        <div className="text-center text-base-content">{t('shared.loading')}</div>
      ) : (
        <>
          <BudgetOverview budgets={budgets} />
          <BudgetGrid onAddClick={() => setShowBudgetModal(true)} />
        </>
      )}

      {showBudgetModal && (
        <AddBudgetModal onClose={() => setShowBudgetModal(false)} />
      )}

      {editTargetId && selectedBudget && (
        <EditBudgetModal budget={selectedBudget} onClose={closeEditModal} />
      )}

      {editTargetId && isLoadingBudget && (
        <div className="fixed inset-0 bg-base-content/30 flex items-center justify-center z-50">
          <div className="p-4 bg-base-100 rounded-xl shadow-xl">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      )}
    </div>
  );
}
