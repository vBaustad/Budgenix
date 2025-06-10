import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatCurrency } from '../../../utils/formatting';
import { useCurrency } from '../../../context/CurrencyContext';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#ffbb28', '#00c49f'];

export type BreakdownPieChartProps<T> = {
  data: T[];
  groupBy: (item: T) => string;
  getValue: (item: T) => number;
  title?: string;
  size?: number;
  height?: number;
  width?: number;
};

export default function BreakdownPieChart<T>({
  data,
  groupBy,
  getValue,
  size = 200,
  height = 400,
  width = 400,
}: BreakdownPieChartProps<T>) {
  const { currency: userCurrency } = useCurrency();

  const chartData = useMemo(() => {
    const map = new Map<string, number>();

    data.forEach((item) => {
      const key = groupBy(item);
      const value = getValue(item);
      map.set(key, (map.get(key) || 0) + value);
    });

    return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
  }, [data, groupBy, getValue, userCurrency]);

  return (
    <div className="flex w-full h-[600px] justify-between">
      {/* Category Totals List */}
      <div className="w-1/4 space-y-2 border border-primary bg-primary/10 rounded-xl p-4 mt-4">
        {[...chartData]
          .sort((a, b) => b.value - a.value)
          .map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm text-based-content">
              <span className="truncate">{item.label}</span>
              <span className="font-semibold">{formatCurrency(item.value, userCurrency)}</span>
            </div>
          ))}
      </div>

      {/* Pie Chart */}
      <div className="flex">
        <PieChart width={width} height={height}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="label"
            outerRadius={size}
            fill="#8884d8"
            label={({ name }) => name}
            labelLine
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
}
