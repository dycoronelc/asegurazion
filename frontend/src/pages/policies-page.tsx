import { type ColumnDef } from '@tanstack/react-table'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge, Card } from '../components/ui/primitives'
import { DataTable } from '../components/ui/data-table'
import { policies, type Policy } from '../mocks/demo-data'
import { formatCurrency, formatShortDate } from '../lib/utils'

const columns: Array<ColumnDef<Policy>> = [
  {
    accessorKey: 'policyNumber',
    header: 'Póliza',
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-slate-900">{row.original.policyNumber}</div>
        <div className="mt-1 text-xs text-slate-500">{row.original.product}</div>
      </div>
    ),
  },
  {
    accessorKey: 'insurer',
    header: 'Aseguradora',
  },
  {
    accessorKey: 'line',
    header: 'Ramo',
  },
  {
    accessorKey: 'premium',
    header: 'Prima',
    cell: ({ row }) => formatCurrency(row.original.premium),
  },
  {
    accessorKey: 'endDate',
    header: 'Vigencia final',
    cell: ({ row }) => formatShortDate(row.original.endDate),
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => (
      <Badge
        tone={
          row.original.status === 'Vigente'
            ? 'success'
            : row.original.status === 'Renovada'
              ? 'brand'
              : row.original.status === 'Morosa'
                ? 'warning'
                : 'danger'
        }
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <Link
        to={`/policies/${row.original.id}`}
        className="inline-flex items-center gap-2 font-medium text-brand-600"
      >
        Ver detalle
        <ArrowRight className="h-4 w-4" />
      </Link>
    ),
  },
]

export function PoliciesPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        {[
          ['Total pólizas', policies.length],
          ['Vigentes', policies.filter((policy) => policy.status === 'Vigente').length],
          ['En mora', policies.filter((policy) => policy.status === 'Morosa').length],
          ['Renovadas', policies.filter((policy) => policy.status === 'Renovada').length],
        ].map(([label, value]) => (
          <Card key={label}>
            <div className="text-sm text-slate-500">{label}</div>
            <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</div>
          </Card>
        ))}
      </section>

      <Card>
        <div className="mb-6">
          <h2 className="section-title">Portafolio consolidado</h2>
          <p className="section-subtitle">
            Pólizas homologadas de diferentes aseguradoras con foco en vigencia, prima y estado.
          </p>
        </div>
        <DataTable
          columns={columns}
          data={policies}
          searchAccessor="policyNumber"
          searchPlaceholder="Buscar por número de póliza"
        />
      </Card>
    </div>
  )
}
