import { InsightDto } from "@/types/insights/insight";
import { useEffect, useState } from "react";

export function useInsights(month: number, year: number) {
  const [insights, setInsights] = useState<InsightDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    const isPast = year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1);
    const isFuture = year > now.getFullYear() || (year === now.getFullYear() && month > now.getMonth() + 1);

    if (isPast || isFuture) {
      setInsights([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/insights?month=${month}&year=${year}`);
        const json = await res.json();
        setInsights(json);
      } catch (err) {
        console.error('Failed to load insights:', err);
        setInsights([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month, year]);

  return { insights, loading };
}
