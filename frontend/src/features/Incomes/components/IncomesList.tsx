import DataTable from '@/components/common/tables/DataTable';
import { Income } from '@/types/finance/income';
import { formatCurrency, formatDate, truncateText } from '@/utils/formatting';
import { useCurrency } from '@/context/CurrencyContext';

export default function IncomesList({ incomes }: { incomes: Income[] }) {
  const { currency } = useCurrency();
  const minRows = 15;

  const openEditModal = (item: Income) => {
    // TODO: Open edit modal
    console.log('Edit:', item);
  };

  const confirmDelete = (id: string) => {
    // TODO: Show confirm modal
    console.log('Delete:', id);
  };

  const paddedIncomes = [...incomes];
  while (paddedIncomes.length < minRows) {
    paddedIncomes.push({
      id: `placeholder-${paddedIncomes.length}`,
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
      data={paddedIncomes}
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
