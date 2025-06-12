import BreakdownPieChart from '@/components/common/charts/BreakdownPieChart';
import SectionShell from '@/components/layout/SectionShell';
import { AppIcons } from '@/components/icons/AppIcons';
import { GROUP_OPTIONS } from '@/features/expenses/constants/grouping';
import IncomeOverview from '@/features/Incomes/components/IncomeOverview';
import AddIncomeForm from '@/features/Incomes/components/AddIncomeForm';
import { useIncomes } from '@/features/Incomes/context/IncomesContext';
import { useRecurring } from '@/context/RecurringContext';
import { useCategories } from '@/context/CategoryContext';
import UpcomingRecurringList from '@/features/recurring/components/UpcomingRecurringList';
import EditRecurringItemForm from '@/features/recurring/components/EditRecurringItemForm';
import RecurringSummary from '@/features/recurring/components/RecurringSummary';
import CategoryFilter from '@/components/common/filters/CategoryFilter';
import GroupByDropdown from '@/components/common/filters/GroupByDropdown';
import { t } from 'i18next';
import { Income } from '@/types/finance/income';
import { useMemo } from 'react';
import IncomesList from '@/features/Incomes/components/IncomesList';
import GroupedIncomesList from '@/features/Incomes/components/GroupedIncomesList';
import { formatCurrency } from '@/utils/formatting';


export type GroupByOption = typeof GROUP_OPTIONS[number]['value'];

export default function IncomePage() {

  const {
  incomes,
  groupedIncomes,
  loading,
  groupBy,
  setGroupBy,
  selectedCategories,
  setSelectedCategories,
  handleAddIncome,
  overview,
  overviewLoading,
  } = useIncomes();

  const {
  recurringIncomes,
  loadingRecurring,
  refreshRecurring,
  selectedRecurringItem,
  setSelectedRecurringItem,
  lastTriggeredRecurringIncome,
  monthlyRecurringIncomeTotal,
} = useRecurring();

  const { categories } = useCategories();
  const chartData = useMemo(() => incomes, [incomes]);
  
  const categoryOptions = categories.map((c) => ({
  value: c.id,
  label: c.name,
  }));

  const handleRecurringSave = async () => {
    setSelectedRecurringItem(null);
    await refreshRecurring();
  };
    
  return (
    <div className="flex flex-col p-2">
      <IncomeOverview />

      <div className="flex flex-col lg:flex-row">
        <SectionShell title="Add Income" icon={AppIcons.add}>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left: Add Income Form */}
            <div className="lg:w-1/2">
              <AddIncomeForm onAdd={handleAddIncome} />
            </div>

            {/* Right: Overview summary */}
            <div className="lg:w-1/2 bg-base-100 border border-base-200 text-base-content rounded-xl shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-4">Income Overview</h3>

              {overviewLoading ? (
                <span className="loading loading-spinner loading-md" />
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total income:</span>
                    <span className="font-medium">{formatCurrency(overview?.totalIncome ?? 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last month:</span>
                    <span className="font-medium">{formatCurrency(overview?.lastMonthIncome ?? 0)}</span>
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
            {/* LEFT: Recurring list */}
            <div className="w-full lg:w-1/2">
              <UpcomingRecurringList
                recurringItems={recurringIncomes}
                loading={loadingRecurring}
                onSelect={setSelectedRecurringItem}
              />
            </div>
            {/* RIGHT: Edit or Summary */}
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

      <div className="flex flex-col lg:flex-row">
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
              ) : groupBy ? (
                <GroupedIncomesList data={groupedIncomes} groupBy={groupBy} />
              ) : (
                <IncomesList incomes={incomes} />
              )}
            </div>          
          </SectionShell>
          <SectionShell title="Spending by Category" icon={AppIcons.pieChart}>
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
