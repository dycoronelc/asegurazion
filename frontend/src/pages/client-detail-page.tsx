import { Navigate, useParams } from 'react-router-dom'

import { Badge, Card } from '../components/ui/primitives'
import { formatCurrency, formatShortDate } from '../lib/utils'
import { getClientById, getPoliciesByClientId } from '../mocks/demo-data'

export function ClientDetailPage() {
  const { clientId } = useParams()
  const client = clientId ? getClientById(clientId) : undefined

  if (!client) {
    return <Navigate to="/clients" replace />
  }

  const portfolio = getPoliciesByClientId(client.id)

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-sm text-slate-500">{client.personType}</div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                {client.fullName}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {client.document} · {client.city}
              </p>
            </div>
            <Badge tone={client.status === 'Activo' ? 'success' : 'warning'}>{client.status}</Badge>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="surface-muted p-4">
              <div className="text-sm text-slate-500">Contacto</div>
              <div className="mt-2 text-sm font-medium text-slate-900">{client.email}</div>
              <div className="mt-1 text-sm text-slate-600">{client.phone}</div>
            </div>
            <div className="surface-muted p-4">
              <div className="text-sm text-slate-500">Ejecutivo</div>
              <div className="mt-2 text-sm font-medium text-slate-900">{client.executive}</div>
              <div className="mt-1 text-sm text-slate-600">Atención estratégica y renovaciones</div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="section-title">Resumen de cartera</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="surface-muted p-4">
              <div className="text-sm text-slate-500">Prima total</div>
              <div className="mt-2 text-2xl font-semibold text-slate-900">
                {formatCurrency(client.totalPremium)}
              </div>
            </div>
            <div className="surface-muted p-4">
              <div className="text-sm text-slate-500">Pólizas</div>
              <div className="mt-2 text-2xl font-semibold text-slate-900">
                {client.policiesCount}
              </div>
            </div>
            <div className="surface-muted p-4">
              <div className="text-sm text-slate-500">Aseguradoras</div>
              <div className="mt-2 text-2xl font-semibold text-slate-900">
                {client.insurerCount}
              </div>
            </div>
            <div className="surface-muted p-4">
              <div className="text-sm text-slate-500">Riesgo</div>
              <div className="mt-2 text-2xl font-semibold text-slate-900">{client.riskScore}</div>
            </div>
          </div>
        </Card>
      </section>

      <Card>
        <div className="mb-6">
          <h2 className="section-title">Pólizas del cliente</h2>
          <p className="section-subtitle">
            Portafolio consolidado con foco en renovación, vigencia y prima administrada.
          </p>
        </div>
        <div className="grid gap-4">
          {portfolio.map((policy) => (
            <div key={policy.id} className="surface-muted p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-slate-500">
                    {policy.insurer} · {policy.line}
                  </div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">{policy.product}</div>
                  <div className="mt-1 text-sm text-slate-500">{policy.policyNumber}</div>
                </div>
                <Badge
                  tone={
                    policy.status === 'Vigente'
                      ? 'success'
                      : policy.status === 'Renovada'
                        ? 'brand'
                        : policy.status === 'Morosa'
                          ? 'warning'
                          : 'danger'
                  }
                >
                  {policy.status}
                </Badge>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Activo</div>
                  <div className="mt-1 text-sm font-medium text-slate-900">{policy.insuredAsset}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Prima</div>
                  <div className="mt-1 text-sm font-medium text-slate-900">
                    {formatCurrency(policy.premium)}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Vigencia final</div>
                  <div className="mt-1 text-sm font-medium text-slate-900">
                    {formatShortDate(policy.endDate)}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Suma asegurada</div>
                  <div className="mt-1 text-sm font-medium text-slate-900">
                    {formatCurrency(policy.sumInsured)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
