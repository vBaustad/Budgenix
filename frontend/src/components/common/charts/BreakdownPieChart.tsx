import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#ffbb28', '#00c49f'];

export type BreakdownPieChartProps<T> = {
  data: T[];
  groupBy: (item: T) => string;
  getValue: (item: T) => number;
  title?: string;
  height?: number;
  width?: number;
};

export default function BreakdownPieChart<T>({
  data,
  groupBy,
  getValue,
  height = 400,
  width = 400,
}: BreakdownPieChartProps<T>) {
  const chartData = useMemo(() => {
    const map = new Map<string, number>();

    data.forEach((item) => {
      const key = groupBy(item);
      const value = getValue(item);
      map.set(key, (map.get(key) || 0) + value);
    });

    return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
  }, [data, groupBy, getValue]);

  return (
    <div className="flex w-full h-[600px] items-center justify-between gap-8 px-4">
    {/* Category Totals List */}
    <div className="w-1/2 max-w-[250px] space-y-2">
        {chartData.map((item, idx) => (
        <div key={idx} className="flex justify-between text-sm text-base-content/80">
            <span className="truncate">{item.label}</span>
            <span className="font-semibold">${item.value.toFixed(2)}</span>
        </div>
        ))}
    </div>

    {/* Pie Chart */}
    <div className="flex-1 flex justify-center">
        <PieChart width={width} height={height}>
        <Pie
            data={chartData}
            dataKey="value"
            nameKey="label"
            outerRadius={140}
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
