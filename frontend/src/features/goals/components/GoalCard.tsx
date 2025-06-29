import { GoalDto } from '@/types/finance/goal';
import { formatCurrency } from '@/utils/formatting';
import { useDeleteGoal } from '../services/GoalsService';
import toast from 'react-hot-toast';
import { AppIcons } from '@/components/icons/AppIcons';
import { useTranslation } from 'react-i18next';

type Props = {
  goal: GoalDto;
  onEdit: () => void;
  onContribute: () => void;
};

export default function GoalCard({ goal, onEdit, onContribute }: Props) {
  const { t } = useTranslation();
  const progress = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
  const { mutate: deleteGoal } = useDeleteGoal();
  const IconComponent = goal.icon ? AppIcons[goal.icon as keyof typeof AppIcons] : null;

  const handleDelete = () => {
    if (confirm(t('goals.confirmDelete', { name: goal.name }))) {
      deleteGoal(goal.id, {
        onSuccess: () => toast.success(t('goals.toast.deleteSuccess')),
        onError: () => toast.error(t('goals.toast.deleteError')),
      });
    }
  };

  const bgTint =
    progress === 100
      ? 'bg-success/10'
      : progress >= 50
      ? 'bg-primary/10'
      : 'bg-base-100';

  return (
    <div className={`card ${bgTint} border border-base-content/10 shadow-sm hover:shadow transition`}>
      <div className="card-body p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 p-1 rounded">
              {IconComponent ? (
                <IconComponent className="w-4 h-4 text-primary" />
              ) : (
                <AppIcons.savings className="w-4 h-4 text-primary" />
              )}
            </div>
            <h3 className="font-medium text-lg">{goal.name}</h3>
          </div>
          <div className="text-s text-base-content/70">
            {t('goals.card.progress', { percent: progress })}
          </div>
        </div>

        <div className="flex justify-between text-s font-medium">
          <span className="text-base-content">{formatCurrency(goal.currentAmount)}</span>
          <span className="text-base-content/60">
            / {formatCurrency(goal.targetAmount)}
          </span>
        </div>

        <div className="w-full h-1.5 bg-base-300 rounded-full overflow-hidden">
          <div
            className={`h-full ${progress >= 100 ? 'bg-success' : 'bg-primary'} transition-all`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex justify-end gap-1.5 flex-wrap pt-1">
          <button onClick={onContribute} className="btn btn-xs btn-outline gap-1">
            <AppIcons.add className="w-3 h-3" />
            {t('goals.card.addContribution')}
          </button>
          <button onClick={onEdit} className="btn btn-xs btn-outline gap-1">
            <AppIcons.edit className="w-3 h-3" />
            {t('shared.edit')}
          </button>
          <button onClick={handleDelete} className="btn btn-xs btn-error gap-1">
            <AppIcons.delete className="w-3 h-3" />
            {t('shared.delete')}
          </button>
        </div>
      </div>
    </div>
  );
}
