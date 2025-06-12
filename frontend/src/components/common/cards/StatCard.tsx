type StatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  valueColor?: string; // e.g. 'text-success'
  diff?: React.ReactNode;
};

export const StatCard = ({
  icon,
  title,
  value,
  valueColor = 'text-base-content',
  diff,
}: StatCardProps) => (
  <div className="rounded-xl p-4 shadow-md bg-base-100 space-y-2 animate-fade-in-up transition-all duration-300">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm font-medium text-base-content">
        {icon}
        {title}
      </div>
      {diff && <span className="text-sm font-medium">{diff}</span>}
    </div>
    <h2 className={`text-2xl font-bold ${valueColor}`}>{value}</h2>
  </div>
);
