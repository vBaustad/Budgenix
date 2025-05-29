// import { AppIcons } from '@/components/icons/AppIcons';

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
  return (
    <div>
      {insights.map((item, idx) => {
        const Icon = item.icon;
        const statusColor =
          item.status === 'warning'
            ? 'text-error'
            : item.status === 'positive'
            ? 'text-success'
            : 'text-base-content';

        return (
          <div key={idx} className="flex items-start gap-3">
            <Icon className={`w-5 h-5 mt-1 ${statusColor}`} />
            <div>
              <p className={`font-medium ${statusColor}`}>{item.title}</p>
              <p className="text-sm text-base-content/70">{item.message}</p>
            </div>
          </div>
        );
      })}

      <div className="mt-4 text-right">
        <button className="btn btn-sm btn-ghost text-sm text-primary hover:underline">
          View full report →
        </button>
      </div>
    </div>
  );
}
