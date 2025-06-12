export type InsightStatus = 'warning' | 'positive' | 'neutral';

export const InsightCategories = {
  Expenses: 'Expenses',
  Income: 'Income',
  Budget: 'Budget',
  Goals: 'Goals',
  System: 'System',
} as const;


export type InsightCategory = typeof InsightCategories[keyof typeof InsightCategories];


export interface InsightDto {
  icon: string;
  title: string;
  message: string;
  status?: InsightStatus;
  category: InsightCategory;
}
