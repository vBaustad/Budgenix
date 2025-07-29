import { useMemo, useState } from 'react';
import { ParsedTransactionDto, BankTransactionType, ImportSummaryDto } from '../types/bankStatements';
import { useCategories } from '@/context/CategoryContext';
import { formatDateInputValue } from '@/utils/formatting';
import { TableVirtuoso } from 'react-virtuoso';
import { useImportParsedTransactions } from '../hooks/useBankStatements';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateFinanceCache } from '@/utils/invalidateFinanceCache';


interface Props {
  transactions: ParsedTransactionDto[];
  onClose: () => void;
}

export default function ReviewParsedTransactionsModal({ transactions, onClose }: Props) {
  type GroupKey = 'uncategorized' | 'categorized' | 'internalTransfer';
  const { categories } = useCategories(); 
  const { mutateAsync: importTx } = useImportParsedTransactions();
  const queryClient = useQueryClient();
  
  const [openSections, setOpenSections] = useState({uncategorized: true, categorized: true, internalTransfer: true});
  const [edited, setEdited] = useState<ParsedTransactionDto[]>([...transactions]);
  const [importing, setImporting] = useState(false);
  const [summary, setSummary] = useState<ImportSummaryDto | null>(null);
  const [progress, setProgress] = useState(0);


  const [groupAssignments] = useState(() => {
    return transactions.map((tx, index) => {
      let group: GroupKey;
      if (tx.isInternalTransfer) group = 'internalTransfer';
      else if (tx.category) group = 'categorized';
      else group = 'uncategorized';
      return { group, index };
    });
  });

  const grouped = useMemo(() => {
    return {
      uncategorized: groupAssignments.filter(g => g.group === 'uncategorized').map(g => ({ tx: edited[g.index], index: g.index })),
      categorized: groupAssignments.filter(g => g.group === 'categorized').map(g => ({ tx: edited[g.index], index: g.index })),
      internalTransfer: groupAssignments.filter(g => g.group === 'internalTransfer').map(g => ({ tx: edited[g.index], index: g.index })),
    };
  }, [edited, groupAssignments]);

  const handleSave = async (transactions: ParsedTransactionDto[]) => {
    try {
      setImporting(true);
      setProgress(5);

      // Animate progress while waiting for import to complete
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 1 : prev));
      }, 150); // every 80ms, increase 1% until 90%

      const summary = await importTx(transactions);

      clearInterval(interval);
      setProgress(100);
      setSummary(summary);
      invalidateFinanceCache(queryClient);
    } catch (err) {
      console.error(err);
      toast.error('Failed to import transactions');
    } finally {
      setImporting(false);
    }
  };



    if (summary) {
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
        <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-md sm:max-w-md md:max-w-l lg:max-w-xl min-h-[300px] p-6 flex flex-col items-center justify-center text-center space-y-4">
          <h2 className="text-lg font-bold">Import Complete</h2>
          <p>{summary.importedIncomes} incomes, {summary.importedExpenses} expenses imported.</p>
          <p>{summary.skipped} skipped. {summary.aiNamesGenerated} AI names generated.</p>
          {summary.warnings.length > 0 && (
            <div className="text-warning text-sm">
              {summary.warnings.map((w, i) => (
                <p key={i}>{w}</p>
              ))}
            </div>
          )}
          <button className="btn btn-primary btn-sm mt-4" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }


  const updateField = <K extends keyof ParsedTransactionDto>(
    index: number,
    field: K,
    value: ParsedTransactionDto[K]
  ) => {
    setEdited(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const renderRow = (_: number, item: { tx: ParsedTransactionDto; index: number }) => {
    const { tx, index: originalIndex } = item;

    return (
      <>
        <td className="w-[140px]">
          <input
            type="text"
            className="input input-xs w-full truncate min-w-0"
            defaultValue={tx.description}
            onBlur={(e) => updateField(originalIndex, 'description', e.target.value)}
          />
        </td>
          <td className="w-[60px]">
            <input
              type="date"
              className="input input-xs w-full min-w-0 text-xs px-1 appearance-none"
              value={formatDateInputValue(tx.date)}
              onChange={(e) => updateField(originalIndex, 'date', e.target.value)}
            />
          </td>
        <td className="w-[60px]">
          <input
            type="number"
            className="input input-xs w-full min-w-0"
            defaultValue={tx.amount}
            onBlur={(e) => updateField(originalIndex, 'amount', parseFloat(e.target.value))}
          />
        </td>
        <td className="w-[50px]">
          <select
            className="select select-xs w-full min-w-0"
            value={tx.isInternalTransfer?.toString() ?? ''}
            onChange={(e) => updateField(originalIndex, 'isInternalTransfer', e.target.value === 'true')}
          >
            <option value="">?</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </td>
        <td className="w-[70px]">
          <select
            className="select select-xs w-full min-w-0"
            value={tx.category ?? ''}
            onChange={(e) => updateField(originalIndex, 'category', e.target.value)}
          >
            <option value="">(none)</option>
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </td>
        <td className="w-[70px]">
          <select
            className="select select-xs w-full min-w-0"
            value={tx.transactionType.toString()}
            onChange={(e) =>
              updateField(originalIndex, 'transactionType', e.target.value as BankTransactionType)
            }
          >
            {Object.entries(BankTransactionType).map(([key, val]) => (
              <option key={key} value={val}>
                {key}
              </option>
            ))}
          </select>
        </td>
        <td className="w-[32px]">
          <input
            type="checkbox"
            className="checkbox checkbox-sm min-w-0"
            checked={!!tx.isIncome}
            onChange={(e) => updateField(originalIndex, 'isIncome', e.target.checked)}
          />
        </td>
      </>
    );
  };

  const renderUncategorizedSection = () => (
    <div className="mb-6">
      <div
        className="cursor-pointer font-semibold text-sm py-2 px-4 bg-base-200 hover:bg-base-300 border border-base-300"
        onClick={() => setOpenSections(prev => ({ ...prev, uncategorized: !prev.uncategorized }))}
      >
        Uncategorized ({grouped.uncategorized.length})
        <span className="float-right">{openSections.uncategorized ? '▾' : '▸'}</span>
      </div>

      <div
        className={`overflow-x-auto border border-t-0 border-base-300 transition-all duration-200 ${
          openSections.uncategorized ? 'block' : 'hidden'
        }`}
      >
        <div className="h-[500px]">
          <TableVirtuoso
            data={grouped.uncategorized}
            itemContent={(index, item) => renderRow(index, item)}
            increaseViewportBy={128}
            components={{
              Table: (props) => <table className="table table-sm w-full table-fixed">{props.children}</table>,
              TableBody: (props) => <tbody {...props} />,
              TableRow: ({ item, ...props }) => {
                const original = transactions[item.index];
                const editedItem = edited[item.index];
                const isEdited = JSON.stringify(original) !== JSON.stringify(editedItem);

                return (
                  <tr
                    {...props}
                    className={isEdited ? 'bg-warning/10' : ''}
                  />
                );
              },
            }}
            fixedHeaderContent={() => (
              <tr>
                <th className="w-[140px] bg-base-100 text-center">Description</th>
                <th className="w-[60px] bg-base-100 text-center">Date</th>
                <th className="w-[60px] bg-base-100 text-center">Amount</th>
                <th className="w-[50px] bg-base-100 text-center">Internal</th>
                <th className="w-[70px] bg-base-100 text-center">Category</th>
                <th className="w-[70px] bg-base-100 text-center">Type</th>
                <th className="w-[32px] bg-base-100 text-center">Income</th>
              </tr>
            )}
          />
        </div>
      </div>
    </div>
  );

  const renderCategorizedSection = () => (
    <div className="mb-6">
      <div
        className="cursor-pointer font-semibold text-sm py-2 px-4 bg-base-200 hover:bg-base-300 border border-base-300"
        onClick={() => setOpenSections(prev => ({ ...prev, categorized: !prev.categorized }))}
      >
        Categorized ({grouped.categorized.length})
        <span className="float-right">{openSections.categorized ? '▾' : '▸'}</span>
      </div>

      <div
        className={`overflow-x-auto border border-t-0 border-base-300 transition-all duration-200 ${
          openSections.categorized ? 'block' : 'hidden'
        }`}
      >
        <div className="h-[500px]">
          <TableVirtuoso
            data={grouped.categorized}
            itemContent={(index, item) => renderRow(index, item)}
            increaseViewportBy={128}
            components={{
              Table: (props) => <table className="table table-sm w-full table-fixed">{props.children}</table>,
              TableBody: (props) => <tbody {...props} />,
            }}
            fixedHeaderContent={() => (
              <tr>
                <th className="w-[140px] bg-base-100 text-center">Description</th>
                <th className="w-[60px] bg-base-100 text-center">Date</th>
                <th className="w-[60px] bg-base-100 text-center">Amount</th>
                <th className="w-[50px] bg-base-100 text-center">Internal</th>
                <th className="w-[70px] bg-base-100 text-center">Category</th>
                <th className="w-[70px] bg-base-100 text-center">Type</th>
                <th className="w-[32px] bg-base-100 text-center">Income</th>
              </tr>
            )}
          />
        </div>
      </div>
    </div>
  );

  const renderInternalTransferSection = () => (
    <div className="mb-6">
      <div
        className="cursor-pointer font-semibold text-sm py-2 px-4 bg-base-200 hover:bg-base-300 border border-base-300"
        onClick={() => setOpenSections(prev => ({ ...prev, internalTransfer: !prev.internalTransfer }))}
      >
        Internal Transfer ({grouped.internalTransfer.length})
        <span className="float-right">{openSections.internalTransfer ? '▾' : '▸'}</span>
      </div>

      <div
        className={`overflow-x-auto border border-t-0 border-base-300 transition-all duration-200 ${
          openSections.internalTransfer ? 'block' : 'hidden'
        }`}
      >
        <div className="h-[500px]">
          <TableVirtuoso
            data={grouped.internalTransfer}
            itemContent={(index, item) => renderRow(index, item)}
            increaseViewportBy={128}
            components={{
              Table: (props) => <table className="table table-sm w-full table-fixed">{props.children}</table>,
              TableBody: (props) => <tbody {...props} />,
            }}
            fixedHeaderContent={() => (
              <tr>
                <th className="w-[140px] bg-base-100 text-center">Description</th>
                <th className="w-[60px] bg-base-100 text-center">Date</th>
                <th className="w-[60px] bg-base-100 text-center">Amount</th>
                <th className="w-[50px] bg-base-100 text-center">Internal</th>
                <th className="w-[70px] bg-base-100 text-center">Category</th>
                <th className="w-[70px] bg-base-100 text-center">Type</th>
                <th className="w-[32px] bg-base-100 text-center">Income</th>
              </tr>
            )}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div
        className={`bg-base-100 relative rounded-lg shadow-lg transition-all duration-300
          ${importing ? 'w-full max-w-md min-h-[180px]' : 'w-full max-w-6xl h-[90vh] min-h-[600px]'}
          flex flex-col`}
      >
        <div className="absolute top-2 right-2 z-10">
          <button
            className="btn btn-xs btn-circle btn-ghost text-lg"
            onClick={onClose}
            disabled={importing}
          >✕</button>
        </div>

        {importing ? (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-md sm:max-w-md md:max-w-l lg:max-w-xl min-h-[300px] p-6 flex flex-col items-center justify-center">
              <progress className="progress w-full sm:w-3/4 mb-4" value={progress} max="100" />
              <p className="text-sm">Importing transactions... {progress}%</p>
            </div>
          </div>
        ) : (
          <>
            <div className="px-6 pt-6 flex justify-between items-start">
              <h2 className="text-xl font-bold">Review Transactions</h2>
            </div>

            <div className="flex-1 overflow-auto px-6 py-2 space-y-4">
              {renderUncategorizedSection()}
              {renderCategorizedSection()}
              {renderInternalTransferSection()}
            </div>

            <div className="flex justify-end gap-2 p-6 border-t border-base-300">
              <button
                className="btn btn-outline btn-sm"
                onClick={onClose}
                disabled={importing}
              >Cancel</button>
              <button
                className="btn btn-primary btn-sm"
                disabled={importing}
                onClick={() => handleSave(edited)}
              >Save All</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}