import {
  PlusIcon,
  PiggyBankIcon,
  PlaneIcon,
  TrophyIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function GoalsPage() {
  const { t } = useTranslation();

  const goals = [
    {
      title: 'Emergency Fund',
      value: 32000,
      target: 50000,
      progress: 64,
      icon: <PiggyBankIcon className="w-5 h-5 text-orange-400" />,
    },
    {
      title: 'Trip to Thailand',
      value: 15000,
      target: 30000,
      progress: 50,
      icon: <PlaneIcon className="w-5 h-5 text-cyan-400" />,
    },
    {
      title: 'Home Down Payment',
      value: 80000,
      target: 200000,
      progress: 40,
      icon: <TrophyIcon className="w-5 h-5 text-yellow-400" />,
    },
  ];

  return (
    <div className="min-h-screen max-w-5xl mx-auto p-8 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">{t('goalsPage.title', 'Your Savings Goals')}</h1>
          <p className="text-base text-base-content/70">
            {t('goalsPage.description', 'Plan, monitor, and achieve your financial targets.')}
          </p>
        </div>
        <button className="btn btn-primary gap-2">
          <PlusIcon className="w-4 h-4" />
          {t('goalsPage.addGoal', 'Add Goal')}
        </button>
      </div>

      {/* Goal List */}
      <div className="divide-y divide-base-content/10 border border-base-content/10 rounded-xl overflow-hidden">
        {goals.map((goal) => (
          <div key={goal.title} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-1 rounded bg-base-300">{goal.icon}</div>
              <div>
                <div className="font-medium">{goal.title}</div>
                <div className="text-sm text-base-content/70">
                  {goal.value.toLocaleString()} / {goal.target.toLocaleString()} kr saved
                </div>
              </div>
            </div>
            <div className="flex-1 sm:ml-4">
              <div className="w-full h-2 bg-base-300 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
              <div className="text-xs text-right mt-1 text-base-content/50">
                {goal.progress}% complete
              </div>
            </div>
            <button className="btn btn-sm btn-ghost text-sm">View</button>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="space-y-2">
        <div className="border-l-4 border-info pl-3 text-base-content/80">
          💡 Consider automating a portion of your monthly income to savings.
        </div>
        <div className="border-l-4 border-warning pl-3 text-base-content/80">
          ⚠️ Your Thailand trip goal is at 50% — adjust timeline?
        </div>
      </div>

      {/* Footer / Call to Action */}
      <div className="pt-10 text-center text-sm text-base-content/60">
        Keep your eyes on the prize. Every krone counts.
      </div>
    </div>
  );
}
