// src/utils/formatting.ts
export const formatCurrency = (val: unknown): string =>
    typeof val === 'number' ? `$${val.toFixed(2)}` : '–';
  
  export const formatDate = (val: unknown): string =>
    val ? new Date(val as string).toLocaleDateString() : '–';
  
  export const truncateText = (val: unknown, max = 60): string =>
    typeof val === 'string' ? val.slice(0, max) + (val.length > max ? '...' : '') : '–';
  