import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { useEffect, useState } from 'react';
import { formatCurrency } from '@/utils/formatting';
import { useCurrency } from '@/context/CurrencyContext';
import { useTranslation } from 'react-i18next';

type Props = {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  showCurrency?: boolean;  
  subtext?: string;
  to?: string;
  icon: React.ReactNode;
  bg: string;
  border: string;
  showProgress: boolean;
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
  showProgress,
  progress = 100,
  emptyMessage,
  animate = true,
  subtext, // NEW
}: Props) {
  const { currency } = useCurrency();
  const { t } = useTranslation();
  const [displayValue, setDisplayValue] = useState(0);

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
  }, [value, animate]);

  const formattedValue =
    showCurrency
      ? formatCurrency(animate ? displayValue : value, currency)
      : (animate ? displayValue : value).toLocaleString();

  const card = (
    <div
      className={cn(
        'group p-6 rounded-2xl bg-gradient-to-br shadow-lg hover:shadow-xl transition-transform hover:scale-[1.02]',
        bg,
        border
      )}
    >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/80 rounded-full">{icon}</div>
        <h3 className="text-xl font-semibold text-base-content">{title}</h3>
      </div>
      {subtext && (
        <div className="text-sm text-base-content/60 mt-1 text-right">
          {subtext}
        </div>
      )}
    </div>


      <div className="text-3xl font-bold mb-1">
        {value === 0 && emptyMessage ? (
          <span className="text-base-content/70 italic">{emptyMessage}</span>
        ) : (
          <>
            {prefix && `${prefix} `}
            {formattedValue}
            {suffix && ` ${suffix}`}
          </>
        )}
      </div>
        {showProgress && (      
          <div className="w-full h-2 mt-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/80 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}


      <div className="text-sm text-base-content mt-1 group-hover:text-white/90 transition">
        {t('dashboard.tapToView')}
      </div>
    </div>
  );

  return to ? <Link to={to}>{card}</Link> : card;
}
