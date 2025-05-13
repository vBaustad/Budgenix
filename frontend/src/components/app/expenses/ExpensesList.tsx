import DataTable from '../../common/tables/DataTable';
import { Expense } from '../../../types/finance/expense';
import { formatCurrency, formatDate, truncateText } from '../../../utils/formatting';

export default function ExpensesList({ expenses }: { expenses: Expense[] }) {
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
          format: formatCurrency,
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
  );
}
