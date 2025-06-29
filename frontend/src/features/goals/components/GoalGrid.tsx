import { GoalDto } from '@/types/finance/goal';
import GoalCard from './GoalCard';
import { useTranslation } from 'react-i18next';

type Props = {
  goals: GoalDto[];
  onAddClick: () => void;
  onEditClick: (id: string) => void;
  onContributeClick: (id: string) => void;
};

export default function GoalGrid({ goals, onAddClick, onEditClick, onContributeClick }: Props) {
  const { t } = useTranslation();

  if (goals.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">{t('goals.grid.noGoals')}</h2>
        <p className="text-base-content/70 mb-6 max-w-md">
          {t('goals.grid.getStarted')}
        </p>
        <button className="btn btn-primary" onClick={onAddClick}>
          + {t('goals.grid.createFirst')}
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onEdit={() => onEditClick(goal.id)}
          onContribute={() => onContributeClick(goal.id)}
        />
      ))}
      <div className="col-span-full flex justify-center mt-4">
        <button className="btn btn-outline btn-primary" onClick={onAddClick}>
          + {t('buttons.addGoal')}
        </button>
      </div>
    </div>
  );
}
