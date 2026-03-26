import { type ColumnDef } from '@tanstack/react-table'

import { Badge, Card } from '../components/ui/primitives'
import { DataTable } from '../components/ui/data-table'
import { delinquencies, type Delinquency } from '../mocks/demo-data'
import { formatCurrency } from '../lib/utils'

const columns: Array<ColumnDef<Delinquency>> = [
  { accessorKey: 'clientName', header: 'Cliente' },
  { accessorKey: 'policyNumber', header: 'Póliza' },
  { accessorKey: 'insurer', header: 'Aseguradora' },
  {
    accessorKey: 'current',
    header: 'Corriente',
    cell: ({ row }) => formatCurrency(row.original.current),
  },
  {
    accessorKey: 'days30',
    header: '30 días',
    cell: ({ row }) => formatCurrency(row.original.days30),
  },
  {
    accessorKey: 'days60',
    header: '60 días',
    cell: ({ row }) => formatCurrency(row.original.days60),
  },
  {
    accessorKey: 'days90',
    header: '90 días',
    cell: ({ row }) => formatCurrency(row.original.days90),
  },
  {
    accessorKey: 'days120Plus',
    header: '120+',
    cell: ({ row }) => formatCurrency(row.original.days120Plus),
  },
]

export function DelinquencyPage() {
  const total = delinquencies.reduce(
    (acc, item) => acc + item.current + item.days30 + item.days60 + item.days90 + item.days120Plus,
    0,
  )

  return (
    <div className="space-y-6">
      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-sm text-slate-500">Saldo total a riesgo</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {formatCurrency(total)}
          </div>
        </div>
        <Badge tone="warning">Seguimiento prioritario</Badge>
      </Card>

      <Card>
        <div className="mb-6">
          <h2 className="section-title">Morosidad consolidada</h2>
          <p className="section-subtitle">
            Distribución por tramos para priorizar gestión de cobro y retención.
          </p>
        </div>
        <DataTable
          columns={columns}
          data={delinquencies}
          searchAccessor="clientName"
          searchPlaceholder="Buscar póliza o cliente"
        />
      </Card>
    </div>
  )
}
