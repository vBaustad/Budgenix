import DataTable from '../../../components/common/tables/DataTable';
import { Expense } from '../../../types/finance/expense';
import { formatCurrency, formatDate, truncateText } from '../../../utils/formatting';
import { useCurrency } from '../../../context/CurrencyContext';

export default function ExpensesList({ expenses }: { expenses: Expense[] }) {
  const { currency } = useCurrency();
  const minRows = 15;

  const openEditModal = (item: Expense) => {
    // TODO: open edit modal
    console.log('Edit:', item);
  };

  const confirmDelete = (id: string) => {
    // TODO: show confirm modal
    console.log('Delete:', id);
  };

  const paddedExpenses = [...expenses];
  while (paddedExpenses.length < minRows) {
    paddedExpenses.push({
      id: `placeholder-${paddedExpenses.length}`,
      name: '',
      description: '',
      amount: 0,
      date: '',
      categoryName: '',
      notes: null,
    });
  }

  return (
    <DataTable
      rowKey="id"
      data={paddedExpenses}
      columns={[
          {
            label: 'Date',
            accessor: 'date',
            format: formatDate,
            width: 'w-[80px]',
            sortable: true,
          },
          {
            label: 'Name',
            accessor: 'name',
            width: 'w-[120px] sm:w-[130px] lg:w-[200px]',
            sortable: true,
          },
          {
            label: 'Description',
            accessor: 'description',
            format: truncateText,
            width: 'w-[150px] sm:w-[180px] lg:w-[240px]',
            sortable: true,
            showOnMobile: false,
          },
          {
            label: 'Amount',
            accessor: 'amount',
            align: 'right',
            format: (val) => formatCurrency(val, currency),
            width: 'w-[80px] sm:w-[100px]',
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
            width: 'w-[100px] sm:w-[150px]',
            sortable: true,
            showOnMobile: false,
          },
        ]}
      actionHandlers={{
        onEdit: openEditModal,
        onDelete: (row) => confirmDelete(row.id),        
      }}
    />
  );
}
