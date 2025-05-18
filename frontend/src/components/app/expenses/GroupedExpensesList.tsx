import { GroupedExpenses } from '../../../types/finance/expense';
import { formatCurrency, formatDate, truncateText } from '../../../utils/formatting';
import DataTable from '../../common/tables/DataTable';
// import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../../context/CurrencyContext';

type GroupedExpensesListProps = {
    data: GroupedExpenses;
    groupBy: 'month' | 'year' | 'category';
  };

export default function GroupedExpensesList({ data, groupBy }: GroupedExpensesListProps) {
//   const { t } = useTranslation();
  const { currency } = useCurrency();

const formatGroupLabel = (key: string | undefined): string => {
  if (!key) return 'Unknown';

  switch (groupBy) {
    case 'month': {
      const [year, month] = key.split('-');
      const date = new Date(Number(year), Number(month) - 1);
      return date.toLocaleString(undefined, { month: 'long', year: 'numeric' });
    }
    case 'year':
    case 'category':
    default:
      return key;
  }
};


  return (
    <div className="flex flex-col gap-6">
      {data.map(({ groupName, expenses }) => (
        <div key={groupName} className="rounded-xl border border-l-4 border-primary bg-base-100 shadow-sm p-4"
        >
          <h3 className="text-lg font-semibold text-base-content mb-3">
            {formatGroupLabel(groupName)}
          </h3>
          <DataTable
            rowKey="id"
            data={expenses}
            columns={[
              {
                label: 'Date',
                accessor: 'date',
                format: formatDate,
                width: '100px',
                sortable: true,
              },
              {
                label: 'Name',
                accessor: 'name',                
                width: '200px',
                sortable: true,
              },
              {
                label: 'Description',
                accessor: 'description',
                format: truncateText,
                width: '400px',
                sortable: true,
              },
              {
                label: 'Amount',
                accessor: 'amount',
                align: 'right',
                format:  (val) => formatCurrency(val, currency),               
                width: '100px',
              },
              {
                label: 'Category',
                accessor: 'categoryName',
                format: (val) =>
                  val ? (
                    <span className="badge badge-sm badge-accent">{val}</span>
                  ) : (
                    <span className="text-base-content/40">–</span>
                  ),                  
                width: '150px',
              },
              {
                label: 'Recurring',
                accessor: 'isRecurring',
                format: (val) =>
                  val ? (
                    <span className="badge badge-outline badge-success text-xs">Yes</span>
                  ) : (
                    <span className="text-base-content/40">No</span>
                  ),
                width: '100px',
                align: 'center',
              },
            ]}
          />
        </div>
      ))}
    </div>
  );
}
