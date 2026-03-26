import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import { cn } from '../../lib/utils'
import { Input } from './primitives'

type DataTableProps<TData> = {
  columns: Array<ColumnDef<TData>>
  data: TData[]
  searchPlaceholder?: string
  searchAccessor?: keyof TData
}

export function DataTable<TData>({
  columns,
  data,
  searchPlaceholder = 'Buscar',
  searchAccessor,
}: DataTableProps<TData>) {
  const [query, setQuery] = useState('')

  const filteredData = useMemo(() => {
    if (!searchAccessor || !query) {
      return data
    }

    return data.filter((item) =>
      String(item[searchAccessor] ?? '')
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
  }, [data, query, searchAccessor])

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          className="pl-10"
          placeholder={searchPlaceholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-5 py-4 font-medium">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-100 hover:bg-brand-50/35">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cn(
                        'px-5 py-4 align-middle text-slate-700',
                        cell.column.id === 'actions' && 'text-right',
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-slate-500">
            No hay resultados con ese criterio.
          </div>
        ) : null}
      </div>
    </div>
  )
}
