import { AppIcons } from '@/components/icons/AppIcons';
import { useTranslation } from 'react-i18next';

type InsightItem = {
  icon: React.ElementType;
  title: string;
  message: string;
  status?: 'neutral' | 'warning' | 'positive';
};

type Props = {
  insights: InsightItem[];
};

export default function InsightCard({ insights }: Props) {
  const { t } = useTranslation();
  const hasInsights = insights.length > 0;

  return (
    <div className="flex flex-col justify-between h-full p-4">
      <div className="space-y-3">
        {hasInsights ? (
          insights.map((item, idx) => {
            const Icon = item.icon;
            const statusColor =
              item.status === 'warning'
                ? 'text-error border-error'
                : item.status === 'positive'
                ? 'text-success border-success'
                : 'text-base-content border-base-content';

            return (
              <div
                key={idx}
                className={`border-l-4 p-4 border border-base-300 bg-base-100 w-full ${statusColor}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 mt-1 ${statusColor}`} />
                  <div>
                    <p className={`font-semibold ${statusColor}`}>{item.title}</p>
                    <p className="text-sm text-base-content/70">{item.message}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-base-content/70 h-full py-12">
            <AppIcons.info className="w-8 h-8 mb-2 text-base-content/40" />
            <p className="font-medium text-base">{t('insights.empty.title')}</p>
            <p className="text-sm text-base-content/60">
              {t('insights.empty.subtitle')}
            </p>
          </div>
        )}
      </div>

      {hasInsights && (
        <div className="mt-4 text-right">
          <button className="btn btn-sm btn-ghost text-sm text-primary hover:underline">
            {t('insights.viewReport')}
          </button>
        </div>
      )}
    </div>
  );
}
