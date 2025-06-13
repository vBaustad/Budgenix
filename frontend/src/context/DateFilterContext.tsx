// src/context/DateFilterContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';

type DateFilterContextType = {
  selectedMonth: number;
  setSelectedMonth: (val: number) => void;
  selectedYear: number;
  setSelectedYear: (val: number) => void;
  resetToCurrent: () => void;
};

const DateFilterContext = createContext<DateFilterContextType | undefined>(undefined);

export function DateFilterProvider({ children }: { children: React.ReactNode }) {
  const now = new Date();
  const initialMonth = Number(localStorage.getItem('selectedMonth')) || now.getMonth() + 1;
  const initialYear = Number(localStorage.getItem('selectedYear')) || now.getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedYear, setSelectedYear] = useState(initialYear);

  useEffect(() => {
    localStorage.setItem('selectedMonth', selectedMonth.toString());
  }, [selectedMonth]);

  useEffect(() => {
    localStorage.setItem('selectedYear', selectedYear.toString());
  }, [selectedYear]);

  const resetToCurrent = () => {
    const now = new Date();
    setSelectedMonth(now.getMonth() + 1);
    setSelectedYear(now.getFullYear());
  };

  return (
    <DateFilterContext.Provider
      value={{
        selectedMonth,
        setSelectedMonth,
        selectedYear,
        setSelectedYear,
        resetToCurrent,
      }}
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
