import { AppIcons } from '../icons/AppIcons';

type Props = {
  selectedMonth: number;
  setSelectedMonth: (val: number) => void;
  selectedYear: number;
  setSelectedYear: (val: number) => void;
};

export function DatePickerControls({
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
}: Props) {
  const monthNames = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString(undefined, { month: 'long' })
  );

  const handlePrev = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNext = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  return (
    <div className="flex items-center gap-1 text-sm text-base-content/80">
      <button
        className="btn btn-xs btn-ghost"
        onClick={handlePrev}
        aria-label="Previous month"
      >
        <AppIcons.left className="w-4 h-4" />
      </button>
      <span className="flex items-center gap-1 font-medium rounded hover:bg-base-100 transition">
        <AppIcons.calendar className="w-4 h-4 opacity-60" />
        {monthNames[selectedMonth - 1]} {selectedYear}
      </span>
      <button
        className="btn btn-xs btn-ghost"
        onClick={handleNext}
        aria-label="Next month"
      >
        <AppIcons.right className="w-4 h-4" />
      </button>
    </div>
  );
}
