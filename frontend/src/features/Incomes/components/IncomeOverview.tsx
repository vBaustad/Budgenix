import IncomeOverviewStats from './IncomeOverviewStats';
import IncomeMonthlyChart from './IncomeMonthlyChart';
import { useIncomesContext } from '../context/IncomesContext';
import { useEffect } from 'react';

export default function IncomeOverview() {
  const { overview, overviewLoading, refreshOverview } = useIncomesContext();

  useEffect(() => {
    refreshOverview();
  }, [refreshOverview]);

  return (
    <div className="flex flex-col gap-4 w-full overflow-hidden">
      <IncomeOverviewStats
        totalIncome={overview?.totalIncome ?? 0}
        lastMonthIncome={overview?.lastMonthIncome ?? 0}
        annualIncome={overview?.annualIncome ?? 0}
        avgMonthly={overview?.avgMonthly ?? 0}
        loading={overviewLoading}
      />

      <div className="hidden sm:block w-full overflow-x-auto">
        <IncomeMonthlyChart />
      </div>
    </div>
  );
}
