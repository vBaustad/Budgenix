import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useIncomeMonthlySummary } from '../hooks/useIncomeMonthlySummary';
import { subMonths, format } from 'date-fns';
import { useCurrency } from '@/context/CurrencyContext';
import { formatCurrency } from '@/utils/formatting';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function IncomeMonthlyChart() {
  const { data, isLoading } = useIncomeMonthlySummary(6);
  const { currency } = useCurrency();

  if (isLoading || !data) return <LoadingSpinner />;

  // Transform data to group by month with categories as keys
  const grouped: Record<string, Record<string, number>> = {};
  const categories = new Set<string>();

  const CATEGORY_COLORS: Record<string, string> = {
  Salary: '#34d399',          // green
  Freelance: '#60a5fa',       // blue
  Pension: '#f87171',         // red
  Investments: '#fbbf24',     // amber
  Miscellaneous: '#a78bfa',   // purple
  Refunds: '#f472b6',         // pink
  Fuel: '#fb923c',            // orange
  Education: '#818cf8',       // indigo
  Transportation: '#4ade80',  // light green
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
  CATEGORY_COLORS[category] || '#c084fc'; // fallback purple

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(val) => formatCurrency(val, currency)} />
        <Tooltip formatter={(val: number) => formatCurrency(val, currency)} />
        <Legend />
        {[...categories].map((cat) => (
          <Bar key={cat} dataKey={cat} stackId="a" fill={getColor(cat)} barSize={20} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
