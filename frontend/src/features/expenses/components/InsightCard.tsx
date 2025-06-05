// import { AppIcons } from '@/components/icons/AppIcons';

import { AppIcons } from "@/components/icons/AppIcons";

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
  const hasInsights = insights.length > 0;

  return (
    <div className="flex flex-col justify-between h-full p-4">
      <div className="space-y-3">
        {hasInsights ? (
          insights.map((item, idx) => {
            const Icon = item.icon;
            const statusColor =
              item.status === 'warning'
                ? 'error'
                : item.status === 'positive'
                ? 'success'
                : 'base-content';

            return (
            <div
              key={idx}
              className={`border-l-4 p-4 rounded-xl bg-base-100 shadow-md border w-full border-${statusColor}`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 mt-1 text-${statusColor}`} />
                <div>
                  <p className={`font-semibold text-${statusColor}`}>{item.title}</p>
                  <p className="text-sm text-base-content/70">{item.message}</p>
                </div>
              </div>
            </div>

            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-base-content/70 h-full py-12">
            <AppIcons.info className="w-8 h-8 mb-2 text-base-content/40" />
            <p className="font-medium text-base">No insights available</p>
            <p className="text-sm text-base-content/60">Try selecting a different month or update your data.</p>
          </div>
        )}
      </div>

      {hasInsights && (
        <div className="mt-4 text-right">
          <button className="btn btn-sm btn-ghost text-sm text-primary hover:underline">
            View full report →
          </button>
        </div>
      )}
    </div>
  );
}
