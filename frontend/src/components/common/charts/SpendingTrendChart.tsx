import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  CartesianGrid,
  YAxis,
  XAxis,
  ReferenceLine,
} from 'recharts';
import { useMemo } from 'react';
import { formatCurrency } from '@/utils/formatting';
import { useCurrency } from '@/context/CurrencyContext';
import { DotProps } from 'recharts';
import { AppIcons } from '@/components/icons/AppIcons';
import { useDateFilter } from '@/context/DateFilterContext';

type ViewMode = 'daily' | 'monthly' | 'yearly';
type CustomPayload = { isMax?: boolean; isMin?: boolean };
type Props = {
  data: number[];
  view?: ViewMode;
  year?: number;
  month?: number;
  highlightSpikes?: boolean;
};


type TooltipProps = {
  active?: boolean;
  payload?: {
    payload: CustomPayload & { value: number };
  }[];
  label?: string;
  currency: string;
};

// Utility: Generate chart data based on view mode
function getChartData(view: ViewMode, data: number[], year: number, month: number, isCurrentMonth: boolean) {
  if (view === 'daily') {
    const daysInMonth = new Date(year, month, 0).getDate(); // get correct number of days
    const numDays = isCurrentMonth ? new Date().getDate() : daysInMonth;
    return Array.from({ length: numDays }, (_, i) => {
      const date = new Date(year, month - 1, i + 1); // 👈 FIXED HERE
      return {
        label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        value: data[i] ?? 0,
      };
    });
  }

  if (view === 'monthly') {
    return [{ label: '', value: 0 },
      ...Array.from({ length: 12 }, (_, i) => ({
        label: new Date(year, i).toLocaleString(undefined, { month: 'short' }),
        value: data[i] ?? 0,
      })),
      { label: '', value: 0 }
    ];
  }

  if (view === 'yearly') {
    const startYear = year - 5;
    return [{ label: '', value: 0 },
      ...Array.from({ length: 6 }, (_, i) => ({
        label: `${startYear + i}`,
        value: data[i] ?? 0,
      })),
      { label: '', value: 0 }
    ];
  }

  return [];
}

// Utility: Calculate min, max
function getMinMax(data: { value: number }[]) {
  if (data.length === 0) return [0, 0];
  const values = data.map((d) => d.value);
  return [Math.min(...values), Math.max(...values)];
}

// Utility: Average
function getAverage(data: { value: number }[]) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  return data.length ? Math.round(total / data.length) : 0;
}

export default function SpendingTrendChart({
  data,
  view = 'daily',
  highlightSpikes = false,
}: Props) {
  const { selectedMonth, selectedYear } = useDateFilter();
  const year = selectedYear;
  const month = selectedMonth;

const now = new Date();
const isCurrentMonth =
  year === now.getFullYear() && month === now.getMonth() + 1;


const chartData = useMemo(() => getChartData(view, data, year, month, isCurrentMonth), [view, data, year, month, isCurrentMonth]);
const [min, max] = useMemo(() => getMinMax(chartData), [chartData]);
const avg = useMemo(() => getAverage(chartData), [chartData]);

const chartDataWithSpikes = useMemo(() => {
  return chartData.map((d) => ({
    ...d,
    isMax: d.value === max,
    isMin: d.value === min,
  }));
}, [chartData, max, min]);

const MinMaxHighlightDot = (props: DotProps & { payload?: CustomPayload }) => {
  const { cx, cy, payload } = props;

  if (cx == null || cy == null || !payload) return null;

  const { isMax, isMin } = payload;
  const radius = isMax || isMin ? 6 : 3;
  const fill = isMax ? '#dc2626' : isMin ? '#16a34a' : '#ef4444';

  return (
    <circle
      cx={cx}
      cy={cy}
      r={radius}
      fill={fill}
      stroke="white"
      strokeWidth={1}
    />
  );
};

const ChartHeader = ({ view, now }: { view: ViewMode; now: Date }) => (
  <h1 className="font-semibold text-base-content/70 mb-1">
    {view === 'daily' && `Daily Spending – ${now.toLocaleString(undefined, { month: 'long', year: 'numeric' })}`}
    {view === 'monthly' && `Monthly Spending – ${now.getFullYear()}`}
    {view === 'yearly' && `Yearly Spending Overview`}
  </h1>
);

const CustomTooltip = ({ active, payload, label, currency }: TooltipProps) => {
  if (!active || !payload?.length) return null;

  const { isMax, isMin, value } = payload[0].payload;

  return (
    <div className="bg-base-100 rounded px-2 py-1 text-sm shadow">
      <div className="flex items-center gap-1 font-medium">
        {isMax && <AppIcons.arrowUp className="text-error w-4 h-4" />}
        {isMin && <AppIcons.arrowDown className="text-success w-4 h-4" />}
        <span>{formatCurrency(value, currency)}</span>
      </div>
      <div className="text-xs text-base-content/70">{label}</div>
    </div>
  );
};

const { currency: userCurrency } = useCurrency();
  return (
    <>
    <ChartHeader view={view} now={now} />
    <div className="flex justify-between text-sm font-medium tracking-wide tabular-nums px-1 mb-1">
    <span className="text-success">Min: {formatCurrency(min, userCurrency)}</span>
    <span className="text-error">Max: {formatCurrency(max, userCurrency)}</span>
    </div>

    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartDataWithSpikes}
          margin={{ top: 20, right: 12, left: 12, bottom: 30 }}
        >
        <CartesianGrid stroke="#cbd5e1" strokeDasharray="3 3" vertical={false} />
        <XAxis
        dataKey="label"
        padding={{ left: 10, right: 10 }}
        tick={{ dy: 10, fontSize: 10 }}
        interval={0}
        angle={-30}
        textAnchor="end"
        />
        <YAxis hide domain={['auto', 'auto']} />
        <Tooltip
            content={
                <CustomTooltip currency={userCurrency} />
            }
        />
        <Line
            type="monotone"
            dataKey="value"
            stroke="#ef4444"
            strokeWidth={2}
            dot={highlightSpikes ? <MinMaxHighlightDot /> : false}
        />
        <ReferenceLine
        y={avg}
        stroke="#3b82f6"
        strokeDasharray="4 4"
        label={{
            value: `Avg: ${formatCurrency(avg, userCurrency)}`,
            position: 'insideTop',
            fontSize: 12,
            fill: '#3b82f6',
        }}
        />
        </LineChart>
      </ResponsiveContainer>
    </div>
    </>
  );
}
