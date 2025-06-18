import { useMemo } from 'react';
import { useIncomes } from '@/features/Incomes/services/incomesService';
import { Income } from '@/types/finance/income';
import { useDateFilter } from '@/context/DateFilterContext';
import { useIncomesContext } from '@/features/Incomes/context/IncomesContext';
import { useRecurring } from '@/context/RecurringContext';
import { useCategories } from '@/context/CategoryContext';
import SectionShell from '@/components/layout/SectionShell';
import { AppIcons } from '@/components/icons/AppIcons';
import IncomeOverview from '@/features/Incomes/components/IncomeOverview';
import AddIncomeForm from '@/features/Incomes/components/AddIncomeForm';
import IncomesList from '@/features/Incomes/components/IncomesList';
import CategoryFilter from '@/components/common/filters/CategoryFilter';
import GroupByDropdown from '@/components/common/filters/GroupByDropdown';
import BreakdownPieChart from '@/components/common/charts/BreakdownPieChart';
import UpcomingRecurringList from '@/features/recurring/components/UpcomingRecurringList';
import EditRecurringItemForm from '@/features/recurring/components/EditRecurringItemForm';
import RecurringSummary from '@/features/recurring/components/RecurringSummary';
import { t } from 'i18next';
import { GROUP_OPTIONS } from '@/features/expenses/constants/grouping';
import { formatCurrency } from '@/utils/formatting';

export default function IncomePage() {
  const { selectedMonth, selectedYear } = useDateFilter();
  const {
    groupBy,
    setGroupBy,
    selectedCategories,
    setSelectedCategories,
    overview,
    overviewLoading,
  } = useIncomesContext();

  const { categories } = useCategories();
  const {
    recurringIncomes,
    loadingRecurring,
    refreshRecurring,
    selectedRecurringItem,
    setSelectedRecurringItem,
    lastTriggeredRecurringIncome,
    monthlyRecurringIncomeTotal,
  } = useRecurring();

  const { data: incomes = [], isLoading: loading } = useIncomes({
    from: new Date(selectedYear, selectedMonth - 1, 1).toISOString(),
    to: new Date(selectedYear, selectedMonth, 0).toISOString(),
    categories: selectedCategories,
    sort: 'dateDesc',
  });

  const chartData = useMemo(() => incomes, [incomes]);

  const categoryOptions = useMemo(() => (
    categories.map(c => ({ value: c.id, label: c.name }))
  ), [categories]);

  const handleRecurringSave = async () => {
    setSelectedRecurringItem(null);
    await refreshRecurring();
  };

  return (
    <div className="flex flex-col gap-4 p-4 w-full max-w-full overflow-hidden">
      <IncomeOverview />

      <div className="flex flex-col lg:flex-row w-full max-w-full gap-4">
        <SectionShell title="Add Income" icon={AppIcons.add}>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="lg:w-1/2">
              <AddIncomeForm onAdd={() => refreshRecurring()} />
            </div>
            <div className="lg:w-1/2 bg-base-100 border border-base-200 text-base-content rounded-xl shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-4">Income Overview</h3>
              {overviewLoading ? (
                <span className="loading loading-spinner loading-md" />
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total income:</span>
                    <span className="font-medium">
                      {formatCurrency(overview?.totalIncome ?? 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last month:</span>
                    <span className="font-medium">
                      {formatCurrency(overview?.lastMonthIncome ?? 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Upcoming recurring:</span>
                    {overview?.upcomingRecurring ? (
                      <span className="font-medium">
                        Next on {new Date(overview.upcomingRecurring.nextDate).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}: {formatCurrency(overview.upcomingRecurring.amount)}
                      </span>
                    ) : (
                      <span className="text-base-content/40">–</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </SectionShell>

        <SectionShell title="Upcoming Income" icon={AppIcons.recurring} refreshable>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-1/2">
              <UpcomingRecurringList
                recurringItems={recurringIncomes}
                loading={loadingRecurring}
                onSelect={setSelectedRecurringItem}
              />
            </div>
            <div className="w-full lg:w-1/2">
              {selectedRecurringItem ? (
                <EditRecurringItemForm
                  item={selectedRecurringItem}
                  onSave={handleRecurringSave}
                  onCancel={() => setSelectedRecurringItem(null)}
                />
              ) : (
                <RecurringSummary
                  recurringItems={recurringIncomes}
                  monthlyTotal={monthlyRecurringIncomeTotal}
                  lastTriggered={lastTriggeredRecurringIncome}
                />
              )}
            </div>
          </div>
        </SectionShell>
      </div>

      <div className="flex flex-col lg:flex-row w-full max-w-full gap-4">
        <SectionShell
          title={t('incomes.allIncomes')}
          icon={AppIcons.list}
          extraHeaderContent={
            <div className="flex gap-4 text-sm font-medium text-base-content">
              <CategoryFilter
                options={categoryOptions}
                selected={selectedCategories}
                onChange={setSelectedCategories}
              />
              <GroupByDropdown
                value={groupBy}
                onChange={setGroupBy}
                options={GROUP_OPTIONS}
              />
            </div>
          }
        >
          <div className="max-h-[600px] overflow-x-auto shadow-md">
            {loading ? (
              <p className="text-base-content/60">{t('shared.loading')}</p>
            ) : (
              <IncomesList incomes={incomes} />
            )}
          </div>
        </SectionShell>

        <SectionShell title="Income by Category" icon={AppIcons.pieChart}>
          <BreakdownPieChart
            data={chartData}
            groupBy={(e) => (e as Income).categoryName || 'Uncategorized'}
            getValue={(e) => (e as Income).amount}
            height={600}
            width={700}
          />
        </SectionShell>
      </div>
    </div>
  );
}
