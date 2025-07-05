// Summary card component
export function SummaryCard({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string;
  value: number;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <div className="p-4 bg-base-100 rounded border border-base-300 flex flex-col items-start gap-1">
      <span className="text-lg">{icon}</span>
      <span className="text-sm text-base-content/70">{label}</span>
      <span
        className={`text-xl font-semibold ${
          highlight ? 'text-success' : ''
        }`}
      >
        {value.toLocaleString()} kr
      </span>
    </div>
  );
}