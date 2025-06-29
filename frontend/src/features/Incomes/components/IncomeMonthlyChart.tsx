import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { useIncomeMonthlySummary } from '../hooks/useIncomeMonthlySummary';
import { subMonths, format } from 'date-fns';
import { useCurrency } from '@/context/CurrencyContext';
import { formatCurrency } from '@/utils/formatting';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';

export default function IncomeMonthlyChart() {
  const { t } = useTranslation();
  const { data, isLoading } = useIncomeMonthlySummary(6);
  const { currency } = useCurrency();

  if (isLoading || !data) return <LoadingSpinner />;

  const grouped: Record<string, Record<string, number>> = {};
  const categories = new Set<string>();

  const CATEGORY_COLORS: Record<string, string> = {
    Salary: '#34d399',
    Freelance: '#60a5fa',
    Pension: '#f87171',
    Investments: '#fbbf24',
    Miscellaneous: '#a78bfa',
    Refunds: '#f472b6',
    Fuel: '#fb923c',
    Education: '#818cf8',
    Transportation: '#4ade80',
  };

  for (const item of data) {
    const month = format(new Date(item.month), 'MMM yyyy');
    if (!grouped[month]) grouped[month] = {};
    grouped[month][item.category] = item.total;
    categories.add(item.category);
  }

  const monthLabels = Array.from({ length: 6 }, (_, i) =>
    format(subMonths(new Date(), 5 - i), 'MMM yyyy')
  );

  const chartData = monthLabels.map((label) => {
    const monthData = grouped[label] || {};
    return {
      month: label,
      ...monthData,
    };
  });

  const getColor = (category: string) =>
    CATEGORY_COLORS[category] || '#c084fc';

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(val) => formatCurrency(val, currency)} />
        <Tooltip formatter={(val: number) => formatCurrency(val, currency)} />
        <Legend formatter={(value) => t(`categories.${value}`)} />
        {[...categories].map((cat) => (
          <Bar
            key={cat}
            dataKey={cat}
            stackId="a"
            fill={getColor(cat)}
            barSize={20}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
