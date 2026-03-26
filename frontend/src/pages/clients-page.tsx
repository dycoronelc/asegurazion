import { type ColumnDef } from '@tanstack/react-table'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge, Card } from '../components/ui/primitives'
import { DataTable } from '../components/ui/data-table'
import { clients, type Client } from '../mocks/demo-data'
import { formatCurrency } from '../lib/utils'

const columns: Array<ColumnDef<Client>> = [
  {
    accessorKey: 'fullName',
    header: 'Cliente',
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-slate-900">{row.original.fullName}</div>
        <div className="mt-1 text-xs text-slate-500">{row.original.document}</div>
      </div>
    ),
  },
  { accessorKey: 'personType', header: 'Tipo' },
  { accessorKey: 'executive', header: 'Ejecutivo' },
  {
    accessorKey: 'policiesCount',
    header: 'Pólizas',
  },
  {
    accessorKey: 'totalPremium',
    header: 'Prima total',
    cell: ({ row }) => formatCurrency(row.original.totalPremium),
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => (
      <Badge
        tone={
          row.original.status === 'Activo'
            ? 'success'
            : row.original.status === 'En renovación'
              ? 'warning'
              : 'brand'
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
        to={`/clients/${row.original.id}`}
        className="inline-flex items-center gap-2 font-medium text-brand-600"
      >
        Ver detalle
        <ArrowRight className="h-4 w-4" />
      </Link>
    ),
  },
]

export function ClientsPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="text-sm text-slate-500">Clientes administrados</div>
          <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            {clients.length}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Clientes jurídicos</div>
          <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            {clients.filter((client) => client.personType === 'Jurídica').length}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Renovaciones activas</div>
          <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            {clients.filter((client) => client.status === 'En renovación').length}
          </div>
        </Card>
      </section>

      <Card>
        <div className="mb-6">
          <h2 className="section-title">Base de clientes</h2>
          <p className="section-subtitle">
            Vista consolidada de contactos, tipo de cliente, ejecutivo responsable y valor de
            cartera.
          </p>
        </div>
        <DataTable
          columns={columns}
          data={clients}
          searchAccessor="fullName"
          searchPlaceholder="Buscar cliente"
        />
      </Card>
    </div>
  )
}
