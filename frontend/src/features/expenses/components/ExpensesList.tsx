import DataTable from '../../../components/common/tables/DataTable';
import { Expense } from '../../../types/finance/expense';
import { formatCurrency, formatDate, truncateText } from '../../../utils/formatting';
import { useCurrency } from '../../../context/CurrencyContext';


export default function ExpensesList({ expenses }: { expenses: Expense[] }) {
  const { currency } = useCurrency();

  return (
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
          format: (val) => formatCurrency(val, currency),
          width: '100px',
          sortable: true,
        },
        {
          label: 'Category',
          accessor: 'categoryName',
          align: 'center',
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
          accessor: 'recurrenceFrequency' as keyof Expense,
          format: (val) => {
            if (typeof val === 'string' && val !== 'None') {
              return <span className="badge badge-outline badge-info text-xs">{val}</span>;
            }
            return <span className="text-base-content/40 text-xs">No</span>;
          },
          width: '130px',
          align: 'center',
        },
      ]}
    />
  );
}
