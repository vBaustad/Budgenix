import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { useEffect, useState } from 'react';
import { formatCurrency } from '@/utils/formatting';
import { useCurrency } from '@/context/CurrencyContext';

type Props = {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  showCurrency?: boolean;
  to?: string;
  icon: React.ReactNode;
  bg: string;
  border: string;
  progress?: number;
  emptyMessage?: string;
  animate?: boolean;
};

export default function DashboardCard({
  title,
  value,
  suffix,
  prefix,
  showCurrency,
  to,
  icon,
  bg,
  border,
  progress = 100,
  emptyMessage,
  animate = true,
}: Props) {
  const [displayValue, setDisplayValue] = useState(0);
  const { currency } = useCurrency();

  useEffect(() => {
    if (!animate) {
      setDisplayValue(value);
      return;
    }

    let current = 0;
    const interval = setInterval(() => {
      const diff = value - current;
      if (Math.abs(diff) < 100) {
        setDisplayValue(value);
        clearInterval(interval);
      } else {
        current += diff * 0.2;
        setDisplayValue(Math.round(current));
      }
    }, 30);

    return () => clearInterval(interval);
  }, [value, animate, currency]);

  const card = (
    <div
      className={cn(
        'group p-6 rounded-2xl bg-gradient-to-br shadow-lg hover:shadow-xl transition-transform hover:scale-[1.02]',
        bg,
        border
      )}
    >
      <div className="flex items-center gap-4 mb-3">
        <div className="p-2 bg-white/80 rounded-full">{icon}</div>
        <h3 className="text-xl font-semibold text-base-content">{title}</h3>
      </div>
        <div className="text-3xl font-bold mb-1">
        {value === 0 && emptyMessage ? (
            <span className="text-base-content/70 italic">{emptyMessage}</span>
        ) : (
            <>
            {prefix && `${prefix} `}
            {showCurrency
                ? formatCurrency(animate ? displayValue : value, currency)
                : (animate ? displayValue : value).toLocaleString()}
            {suffix && ` ${suffix}`}
            </>
        )}
        </div>
      <div className="w-full h-2 mt-3 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-white/80 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-sm text-base-content mt-2 group-hover:text-white/90 transition">
        Tap to view details →
      </div>
    </div>
  );

  return to ? <Link to={to}>{card}</Link> : card;
}
