import React from 'react';

type ProgressCardProps = {
  label: string;
  valueText: React.ReactNode;
  percent: number;
  colorClass: string; // e.g. 'text-success bg-success'
};

export default function ProgressCard({
  label,
  valueText,
  percent,
  colorClass,
}: ProgressCardProps) {
  const [textClass = 'text-base-content', bgClass = 'bg-base-300'] = colorClass.split(' ');

  return (
    <div className="bg-base-100 rounded-xl p-4 shadow-md space-y-2">
      <p className="text-sm text-base-content font-medium truncate">{label}</p>

      <div className="w-full bg-base-200 h-2 rounded-full overflow-hidden">
        <div
          className={`h-2 transition-all duration-700 ease-in-out ${bgClass}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>

      <p className={`text-sm font-medium ${textClass}`}>{valueText}</p>
    </div>
  );
}
