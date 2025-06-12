import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
} from 'react';
import { InsightDto } from '@/types/insights/insight';

type PeriodKey = string; // e.g., '2025-05'

type InsightsContextType = {
  getInsights: (month: number, year: number) => InsightDto[];
  refreshInsights: (month: number, year: number) => Promise<void>;
  loading: boolean;
};

const InsightsContext = createContext<InsightsContextType | undefined>(undefined);

export function InsightsProvider({ children }: { children: ReactNode }) {
  const [insightsMap, setInsightsMap] = useState<Map<PeriodKey, InsightDto[]>>(new Map());
  const [loading, setLoading] = useState(false);
  const fetchedPeriods = useRef<Set<PeriodKey>>(new Set());

  const getKey = (month: number, year: number) => `${year}-${month.toString().padStart(2, '0')}`;

  const refreshInsights = async (month: number, year: number) => {
    const key = getKey(month, year);
    if (fetchedPeriods.current.has(key)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/insights?month=${month}&year=${year}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch insights');
      const data = await res.json();
      setInsightsMap(prev => new Map(prev).set(key, data));
      fetchedPeriods.current.add(key);
    } catch (err) {
      console.error('[InsightsContext] Failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const getInsights = (month: number, year: number) => {
    const key = getKey(month, year);
    return insightsMap.get(key) || [];
  };

  return (
    <InsightsContext.Provider value={{ getInsights, refreshInsights, loading }}>
      {children}
    </InsightsContext.Provider>
  );
}

export function useInsightsContext() {
  const ctx = useContext(InsightsContext);
  if (!ctx) throw new Error('useInsightsContext must be used within InsightsProvider');
  return ctx;
}
