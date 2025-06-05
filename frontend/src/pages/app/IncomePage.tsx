// import BreakdownPieChart from '@/components/common/charts/BreakdownPieChart';
import SectionShell from '@/components/layout/SectionShell';
import { AppIcons } from '@/components/icons/AppIcons';
import { GROUP_OPTIONS } from '@/features/expenses/constants/grouping';
// import { useCategories } from '@/context/CategoryContext';
import IncomeOverview from '@/features/Incomes/components/IncomeOverview';

export type GroupByOption = typeof GROUP_OPTIONS[number]['value'];

export default function IncomePage() {

  // const { categories } = useCategories();

  // const categoryOptions = categories.map((c) => ({
  // value: c.id,
  // label: c.name,
  // }));


  return (
    <div className="flex bg-base-200 flex-col p-2">
      <IncomeOverview />

      <div className="flex flex-col lg:flex-row gap-4">
        <SectionShell title="Add Income" icon={AppIcons.add}>
          <div></div>
          {/* <AddIncomeForm /> */}
        </SectionShell>

        <SectionShell title="Upcoming Income" icon={AppIcons.recurring}>
          <div></div>
          {/* <UpcomingRecurringIncomeList /> */}
        </SectionShell>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <SectionShell title="All Income" icon={AppIcons.list}>
          <div></div>
          {/* <IncomeList /> or GroupedIncomeList */}
        </SectionShell>

        <SectionShell title="Income by Source" icon={AppIcons.pieChart}>
          <div></div>
          {/* <BreakdownPieChart ... /> */}
        </SectionShell>
      </div>
    </div>
  );
}
