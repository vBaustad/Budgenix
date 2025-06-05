// src/context/DateFilterContext.tsx
import { createContext, useContext, useState } from 'react';

type DateFilterContextType = {
  selectedMonth: number;
  setSelectedMonth: (val: number) => void;
  selectedYear: number;
  setSelectedYear: (val: number) => void;
};

const DateFilterContext = createContext<DateFilterContextType | undefined>(undefined);

export function DateFilterProvider({ children }: { children: React.ReactNode }) {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1); // 1-based
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  return (
    <DateFilterContext.Provider
      value={{ selectedMonth, setSelectedMonth, selectedYear, setSelectedYear }}
    >
      {children}
    </DateFilterContext.Provider>
  );
}

export function useDateFilter() {
  const context = useContext(DateFilterContext);
  if (!context) throw new Error('useDateFilter must be used within DateFilterProvider');
  return context;
}
