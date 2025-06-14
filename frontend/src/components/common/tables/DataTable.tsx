import { AppIcons } from '@/components/icons/AppIcons';
import React, { useMemo, useState } from 'react';

type Column<T> = {
  label: string;
  accessor: keyof T;
  format?: (value: T[keyof T]) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
  width?: string;
  sortable?: boolean;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  rowKey?: keyof T;
  emptyMessage?: string;
  actionHandlers?: {
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
  };
};

export default function DataTable<T>({
  columns,
  data,
  rowKey,
  emptyMessage = 'No data found.',
  actionHandlers,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: 'asc' | 'desc';
  } | null>(null);

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal == null || bVal == null) return 0;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return String(aVal).localeCompare(String(bVal)) *
        (sortConfig.direction === 'asc' ? 1 : -1);
    });
  }, [data, sortConfig]);

const handleSort = (key: keyof T) => {
  setSortConfig((prev) => {
    if (!prev || prev.key !== key) {
      return { key, direction: 'asc' };
    }
    if (prev.direction === 'asc') {
      return { key, direction: 'desc' };
    }
    if (prev.direction === 'desc') {
      return null; // ⬅ Reset sorting
    }
    return { key, direction: 'asc' };
  });
};


  return (
    <div className="rounded-xl overflow-hidden bg-base-100 shadow-sm">
      <table className="w-full text-sm rounded-l-none table-fixed divide-x divide-base-300">
        <thead className="bg-base-300 text-base-content font-semibold">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.accessor)}
                onClick={
                  col.sortable
                    ? () => handleSort(col.accessor as keyof T)
                    : undefined
                }
                style={{ width: col.width }}
                className={`
                  px-4 py-2 relative transition select-none 
                  ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                  ${col.sortable ? 'hover:bg-primary/10 cursor-pointer' : ''}
                `}
              >
                <span className="flex items-center gap-1">
                  {col.label}
                  {sortConfig?.key === col.accessor && (
                    <span className="text-xs">
                      {sortConfig.direction === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </span>
              </th>
            ))}
            {actionHandlers && (actionHandlers.onEdit || actionHandlers.onDelete) && (
              <th className="w-[80px] text-center px-4 py-2">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (actionHandlers ? 1 : 0)}
                className="px-4 py-4 text-center text-base-content/50 border-r border-base-300"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, idx) => (
              <tr
                key={rowKey ? String(row[rowKey]) : idx}
                className="even:bg-base-100 odd:bg-base-200 hover:bg-primary/10 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={String(col.accessor)}
                    style={{ width: col.width }}
                    className={`px-4 py-2 whitespace-nowrap text-base-content border-r border-base-300 ${
                      col.align === 'right'
                        ? 'text-right'
                        : col.align === 'center'
                        ? 'text-center'
                        : 'text-left'
                    }`}
                  >
                    {col.format
                      ? col.format(row[col.accessor])
                      : String(row[col.accessor] ?? '')}
                  </td>
                ))}
                {actionHandlers && (actionHandlers.onEdit || actionHandlers.onDelete) && (
                  <td className="p-2 whitespace-nowrap border-r border-base-300">
                    <div className="flex justify-start">
                      {actionHandlers.onEdit && (
                        <button
                          className="btn btn-xs btn-ghost"
                          onClick={() => actionHandlers.onEdit?.(row)}
                        >
                          <AppIcons.edit className="w-4 h-4" />
                        </button>
                      )}
                      {actionHandlers.onDelete && (
                        <button
                          className="btn btn-xs btn-ghost text-error"
                          onClick={() => actionHandlers.onDelete?.(row)}
                        >
                          <AppIcons.delete className="w-4 h-4 text-error hover:text-error-content" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
