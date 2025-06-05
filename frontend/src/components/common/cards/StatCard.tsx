type StatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  valueColor?: string;
  diff?: React.ReactNode;
};


export const StatCard = ({
  icon,
  title,
  value,
  valueColor = '',
  diff,
}: StatCardProps) => (
  <div className="bg-base-100 rounded-xl p-4 shadow-md space-y-1">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1 text-base-content font-medium text-sm">
        {icon}
        {title}
      </div>
      {diff && (
        <span className={`text-sm font-medium`}>
          {diff}
        </span>
      )}
    </div>
    <h2 className={`text-2xl font-bold ${valueColor}`}>{value}</h2>
  </div>
);
