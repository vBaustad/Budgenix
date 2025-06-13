import { useBudgets } from '@/features/budgets/context/BudgetsContext';
import { useTranslation } from 'react-i18next';
import BudgetGrid from '@/features/budgets/components/BudgetGrid';
import { useState } from 'react';
import AddBudgetModal from '@/features/budgets/components/AddBudgetModal';
import BudgetOverview from '@/features/budgets/components/BudgetsOverview';

export default function BudgetsPage() {
  const { t } = useTranslation();
  const { budgets, isLoading } = useBudgets();
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  
  return (
    <div className="min-h-screen p-6 relative">
      {isLoading ? (
        <div className="text-center text-base-content">{t('shared.loading')}</div>
      ) : (
        <>
          <BudgetOverview budgets={budgets} />
          <BudgetGrid budgets={budgets} onAddClick={() => setShowBudgetModal(true)} />
        </>
      )}

      {showBudgetModal && (
        <AddBudgetModal onClose={() => setShowBudgetModal(false)} />
      )}
    </div>
  );
}
