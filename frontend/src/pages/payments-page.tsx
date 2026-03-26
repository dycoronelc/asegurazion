import { type ColumnDef } from '@tanstack/react-table'

import { Badge, Card } from '../components/ui/primitives'
import { DataTable } from '../components/ui/data-table'
import { payments, type Payment } from '../mocks/demo-data'
import { formatCurrency, formatShortDate } from '../lib/utils'

const columns: Array<ColumnDef<Payment>> = [
  {
    accessorKey: 'clientName',
    header: 'Cliente',
  },
  {
    accessorKey: 'policyNumber',
    header: 'Póliza',
  },
  {
    accessorKey: 'amount',
    header: 'Pago',
    cell: ({ row }) => formatCurrency(row.original.amount),
  },
  {
    accessorKey: 'commission',
    header: 'Comisión',
    cell: ({ row }) => formatCurrency(row.original.commission),
  },
  {
    accessorKey: 'channel',
    header: 'Canal',
  },
  {
    accessorKey: 'date',
    header: 'Fecha',
    cell: ({ row }) => formatShortDate(row.original.date),
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => (
      <Badge tone={row.original.status === 'Aplicado' ? 'success' : 'warning'}>
        {row.original.status}
      </Badge>
    ),
  },
]

export function PaymentsPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="text-sm text-slate-500">Pagos procesados</div>
          <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            {payments.length}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Cobrado</div>
          <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            {formatCurrency(payments.reduce((total, item) => total + item.amount, 0))}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Comisiones asociadas</div>
          <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            {formatCurrency(payments.reduce((total, item) => total + item.commission, 0))}
          </div>
        </Card>
      </section>

      <Card>
        <div className="mb-6">
          <h2 className="section-title">Historial de pagos</h2>
          <p className="section-subtitle">Seguimiento de pagos aplicados y pendientes por póliza.</p>
        </div>
        <DataTable
          columns={columns}
          data={payments}
          searchAccessor="clientName"
          searchPlaceholder="Buscar por cliente"
        />
      </Card>
    </div>
  )
}
