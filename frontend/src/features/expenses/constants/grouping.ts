export type GroupByValue = 'month' | 'year' | 'category';

export const GROUP_OPTIONS: { value: GroupByValue; label: string }[] = [
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
  { value: 'category', label: 'Category' },
];
