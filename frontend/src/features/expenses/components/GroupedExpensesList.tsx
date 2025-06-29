import { GroupedExpenses } from '@/types/finance/expense';
import { formatCurrency, formatDate, truncateText } from '@/utils/formatting';
import DataTable from '@/components/common/tables/DataTable';
import { useCurrency } from '@/context/CurrencyContext';
import { useTranslation } from 'react-i18next';

type GroupedExpensesListProps = {
  data: GroupedExpenses;
  groupBy: 'month' | 'year' | 'category';
};

export default function GroupedExpensesList({ data, groupBy }: GroupedExpensesListProps) {
  const { currency } = useCurrency();
  const { t, i18n } = useTranslation();

  const formatGroupLabel = (key: string | undefined): string => {
    if (!key) return t('shared.unknown');

    switch (groupBy) {
      case 'month': {
        const [year, month] = key.split('-');
        const date = new Date(Number(year), Number(month) - 1);
        return date.toLocaleString(i18n.language, { month: 'long', year: 'numeric' });
      }
      case 'year':
        return key;
      case 'category':
        return t(`categories.${key}`, key); // fallback to raw key
      default:
        return key;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {data.map(({ groupName, expenses }) => (
        <div
          key={groupName}
          className="rounded-xl border border-l-4 border-primary bg-base-100 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-base-content mb-2 mt-2 ml-2">
            {formatGroupLabel(groupName)}
          </h3>
          <DataTable
            rowKey="id"
            data={expenses}
            columns={[
              {
                label: t('shared.date'),
                accessor: 'date',
                format: formatDate,
                width: '100px',
                sortable: true,
                showOnMobile: false,
              },
              {
                label: t('shared.name'),
                accessor: 'name',
                width: '150px',
                sortable: true,
              },
              {
                label: t('shared.description'),
                accessor: 'description',
                format: truncateText,
                width: '400px',
                sortable: true,
              },
              {
                label: t('shared.amount'),
                accessor: 'amount',
                align: 'right',
                format: (val) => formatCurrency(val, currency),
                width: '100px',
              },
              {
                label: t('shared.category'),
                accessor: 'categoryName',
                format: (val) =>
                  val ? (
                    <span className="badge badge-sm badge-accent">{val}</span>
                  ) : (
                    <span className="text-base-content/40">–</span>
                  ),
                width: '150px',
              },
            ]}
          />
        </div>
      ))}
    </div>
  );
}
