// src/components/DatePickerControls.tsx
import { AppIcons } from '../icons/AppIcons';

type Props = {
  currentMonth: string;
  selectedMonth: number;
  setSelectedMonth: (val: number) => void;
  selectedYear: number;
  setSelectedYear: (val: number) => void;
};

export function DatePickerControls({
  currentMonth,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      <p className="text-sm text-base-content/70 flex items-center gap-1">
        <AppIcons.calendar className="w-4 h-4 opacity-70" />
        {currentMonth}
      </p>
      <select
        className="select select-xs select-bordered"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(Number(e.target.value))}
      >
        {Array.from({ length: 12 }, (_, i) => (
          <option key={i + 1} value={i + 1}>
            {new Date(0, i).toLocaleString(undefined, { month: 'long' })}
          </option>
        ))}
      </select>
      <input
        type="number"
        min={2000}
        max={2099}
        className="input input-xs input-bordered w-20"
        value={selectedYear}
        onChange={(e) => setSelectedYear(Number(e.target.value))}
      />
    </div>
  );
}
