import React, { useMemo, useState, useEffect } from 'react';
import { AppIcons } from '@/components/icons/AppIcons';
import { useTranslation } from 'react-i18next';

type Column<T> = {
  label: string;
  accessor: keyof T;
  format?: (value: T[keyof T], row?: T) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
  width?: string;
  sortable?: boolean;
  showOnMobile?: boolean;
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
  footer?: React.ReactNode;
};


export default function DataTable<T>({
  columns,
  data,
  rowKey,
  emptyMessage = 'No data found.',
  actionHandlers,
  footer,
}: DataTableProps<T> & { footer?: React.ReactNode }) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSort = (key: keyof T) => {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return null;
    });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal == null || bVal == null) return 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return String(aVal).localeCompare(String(bVal)) * (sortConfig.direction === 'asc' ? 1 : -1);
    });
  }, [data, sortConfig]);

  const visibleColumns = useMemo(() => {
    return columns.filter((col) => {
      if (col.showOnMobile === false && windowWidth < 640) {
        return false;
      }
      return true;
    });
  }, [columns, windowWidth]);

  return (
    <div className="rounded-xl bg-base-100 w-full">
      <div className="overflow-y-auto max-h-[600px]">
        <table className="w-full text-sm table-fixed divide-x divide-base-300">
          <thead className="bg-base-300 text-base-content font-semibold sticky top-0 z-10">
            <tr>
              {visibleColumns.map((col) => (
                <th
                  key={String(col.accessor)}
                  onClick={col.sortable ? () => handleSort(col.accessor as keyof T) : undefined}
                  className={`
                    px-2 py-2 select-none truncate
                    ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                    ${col.sortable ? 'hover:bg-primary/10 cursor-pointer' : ''}
                    ${col.width ?? ''}
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
                <th className="w-[60px] text-center hidden sm:table-cell">{t('shared.actions')}</th>
              )}
            </tr>
          </thead>

          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length + (actionHandlers ? 1 : 0)}
                  className="px-2 py-4 text-center text-base-content/50"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row, idx) => (
                <React.Fragment key={rowKey ? String(row[rowKey]) : idx}>
                  <tr
                    className="even:bg-base-100 odd:bg-base-200 hover:bg-primary/10 transition-colors cursor-pointer"
                    onClick={() => windowWidth < 640 && setExpandedRow(expandedRow === idx ? null : idx)}
                  >
                    {visibleColumns.map((col) => (
                      <td
                        key={String(col.accessor)}
                        className={`px-2 py-2 truncate whitespace-nowrap border-b border-base-300 text-base-content
                          ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                          ${col.width ?? ''}
                        `}
                      >
                        {col.format ? col.format(row[col.accessor], row) : String(row[col.accessor] ?? '')}
                      </td>
                    ))}
                    {actionHandlers && (
                      <td className="p-2 hidden sm:table-cell border-b border-base-300">
                        <div className="flex justify-start gap-1">
                          {actionHandlers.onEdit && (
                            <button
                              className="btn btn-xs btn-ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                actionHandlers.onEdit?.(row);
                              }}
                            >
                              <AppIcons.edit className="w-4 h-4" />
                            </button>
                          )}
                          {actionHandlers.onDelete && (
                            <button
                              className="btn btn-xs btn-ghost text-error"
                              onClick={(e) => {
                                e.stopPropagation();
                                actionHandlers.onDelete?.(row);
                              }}
                            >
                              <AppIcons.delete className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>

                  {windowWidth < 640 && expandedRow === idx && (
                    <tr className="sm:hidden bg-base-300 border-b border-base-300">
                      <td colSpan={visibleColumns.length} className="px-4 py-2">
                        <div className="flex justify-center gap-4">
                          {actionHandlers?.onEdit && (
                            <button
                              className="btn btn-sm btn-ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                actionHandlers.onEdit?.(row);
                                setExpandedRow(null);
                              }}
                            >
                              <AppIcons.edit className="w-4 h-4" />
                              {t('shared.edit')}
                            </button>
                          )}
                          {actionHandlers?.onDelete && (
                            <button
                              className="btn btn-sm btn-ghost text-error"
                              onClick={(e) => {
                                e.stopPropagation();
                                actionHandlers.onDelete?.(row);
                                setExpandedRow(null);
                              }}
                            >
                              <AppIcons.delete className="w-4 h-4 text-error" />
                              {t('shared.delete')}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
          {footer && (
            <tfoot>
              {footer}
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
