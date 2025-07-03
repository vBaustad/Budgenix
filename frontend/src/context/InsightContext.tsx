import {
  createContext,
  useContext,
  useState,
  useRef,
  ReactNode,
} from 'react';
import { InsightDto } from '@/types/insights/insight';
import { apiFetch } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';

type PeriodKey = string; // e.g., "2025-07"

type InsightsContextType = {
  getInsights: (month: number, year: number) => InsightDto[];
  refreshInsights: (month: number, year: number) => Promise<void>;
  loading: boolean;
};

const InsightsContext = createContext<InsightsContextType | undefined>(undefined);

export function InsightsProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();

  const [insightsMap, setInsightsMap] = useState<Map<PeriodKey, InsightDto[]>>(new Map());
  const [loading, setLoading] = useState(false);
  const fetchedPeriods = useRef<Set<PeriodKey>>(new Set());

  const getKey = (month: number, year: number) =>
    `${year}-${month.toString().padStart(2, '0')}`;

  const refreshInsights = async (month: number, year: number): Promise<void> => {
    const key = getKey(month, year);
    if (!isLoggedIn || fetchedPeriods.current.has(key)) return;

    setLoading(true);
    try {
      const data = await apiFetch<InsightDto[]>(`/api/insights?month=${month}&year=${year}`);
      if (!data) throw new Error('No data returned from insights API');

      setInsightsMap(prev => {
        const updated = new Map(prev);
        updated.set(key, data);
        return updated;
      });

      fetchedPeriods.current.add(key);
    } catch (err) {
      console.error(`[InsightsContext] Failed to fetch insights for ${key}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const getInsights = (month: number, year: number): InsightDto[] => {
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
  if (!ctx) {
    throw new Error('useInsightsContext must be used within an InsightsProvider');
  }
  return ctx;
}
