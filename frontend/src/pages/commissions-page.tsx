import { type ColumnDef } from '@tanstack/react-table'
import { ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts'

import { Badge, Card } from '../components/ui/primitives'
import { DataTable } from '../components/ui/data-table'
import { commissions, dashboardTrend, type Commission } from '../mocks/demo-data'
import { formatCurrency, formatShortDate } from '../lib/utils'

const columns: Array<ColumnDef<Commission>> = [
  { accessorKey: 'clientName', header: 'Cliente' },
  { accessorKey: 'policyNumber', header: 'Póliza' },
  { accessorKey: 'insurer', header: 'Aseguradora' },
  {
    accessorKey: 'premiumPaid',
    header: 'Prima pagada',
    cell: ({ row }) => formatCurrency(row.original.premiumPaid),
  },
  {
    accessorKey: 'commissionRate',
    header: '% Comisión',
    cell: ({ row }) => `${row.original.commissionRate}%`,
  },
  {
    accessorKey: 'commissionAmount',
    header: 'Comisión',
    cell: ({ row }) => formatCurrency(row.original.commissionAmount),
  },
  {
    accessorKey: 'date',
    header: 'Fecha',
    cell: ({ row }) => formatShortDate(row.original.date),
  },
]

export function CommissionsPage() {
  const total = commissions.reduce((acc, item) => acc + item.commissionAmount, 0)

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1fr,1fr]">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="section-title">Comisión acumulada</h2>
              <p className="section-subtitle">Ingresos estimados del corredor en la demo</p>
            </div>
            <Badge tone="success">Buen ritmo</Badge>
          </div>
          <div className="mt-6 text-4xl font-semibold tracking-tight text-slate-900">
            {formatCurrency(total)}
          </div>
        </Card>

        <Card className="p-0">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="section-title">Tendencia comercial</h2>
            <p className="section-subtitle">Relación entre cartera y comisiones</p>
          </div>
          <div className="h-[250px] px-2 py-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="comisiones"
                  stroke="#ff6b0b"
                  fill="rgba(255, 107, 11, 0.22)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <Card>
        <div className="mb-6">
          <h2 className="section-title">Detalle de comisiones</h2>
          <p className="section-subtitle">
            Tabla pensada para seguimiento por póliza, cliente y aseguradora.
          </p>
        </div>
        <DataTable
          columns={columns}
          data={commissions}
          searchAccessor="clientName"
          searchPlaceholder="Buscar comisión"
        />
      </Card>
    </div>
  )
}
