'use client';

import { useGoals, useGoalById } from '@/features/goals/services/GoalsService';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import GoalOverview from '@/features/goals/components/GoalOverview';
import GoalGrid from '@/features/goals/components/GoalGrid';
import AddGoalModal from '@/features/goals/components/AddGoalModal';
import EditGoalModal from '@/features/goals/components/EditGoalModal';
import AddGoalContributionModal from '@/features/goals/components/AddGoalContributionModal';

export default function GoalsPage() {
  const { t } = useTranslation();
  const { data: goals = [], isLoading } = useGoals();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  const [contributionTargetId, setContributionTargetId] = useState<string | null>(null);

  const { data: selectedGoal, isLoading: isLoadingGoal } = useGoalById(editTargetId ?? '', {
    enabled: !!editTargetId,
  });

  const { data: contributionGoal } = useGoalById(contributionTargetId ?? '', {
    enabled: !!contributionTargetId,
  });

  return (
    <div className="min-h-screen p-6 relative">
      {isLoading ? (
        <div className="text-center text-base-content">{t('shared.loading')}</div>
      ) : (
        <>
          <GoalOverview goals={goals} />
          <GoalGrid
            goals={goals}
            onAddClick={() => setShowAddModal(true)}
            onEditClick={(id) => setEditTargetId(id)}
            onContributeClick={(id) => setContributionTargetId(id)}
          />
        </>
      )}

      {showAddModal && (
        <AddGoalModal onClose={() => setShowAddModal(false)} />
      )}

      {editTargetId && selectedGoal && (
        <EditGoalModal goal={selectedGoal} onClose={() => setEditTargetId(null)} />
      )}

      {contributionTargetId && contributionGoal && (
        <AddGoalContributionModal
          goal={contributionGoal}
          onClose={() => setContributionTargetId(null)}
        />
      )}

      {editTargetId && isLoadingGoal && (
        <div className="fixed inset-0 bg-base-content/30 flex items-center justify-center z-50">
          <div className="p-4 bg-base-100 rounded-xl shadow-xl">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      )}
    </div>
  );
}
