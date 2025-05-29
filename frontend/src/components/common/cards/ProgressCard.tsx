import React from 'react';

type ProgressCardProps = {
  label: string;
  valueText: React.ReactNode;
  percent: number;
  colorClass: string; // e.g. 'text-error bg-error'
};

export default function ProgressCard({
  label,
  valueText,
  percent,
  colorClass,
}: ProgressCardProps) {
  return (
    <div className="bg-base-100 border border-base-200 rounded-xl p-4 shadow space-y-1">
      <p className="text-sm text-base-content font-medium">{label}</p>
      <div className="w-full bg-base-200 h-2 rounded-full overflow-hidden">
        <div
          className={`h-2 ${colorClass.split(' ')[1]}`} // apply only the bg-* class
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      <p className={`text-sm ${colorClass.split(' ')[0]}`}>{valueText}</p>
    </div>
  );
}
