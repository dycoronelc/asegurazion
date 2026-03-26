import { Navigate, useParams } from 'react-router-dom'

import { Badge, Card } from '../components/ui/primitives'
import { formatCurrency, formatShortDate } from '../lib/utils'
import {
  getClientById,
  getCommissionByPolicyId,
  getDelinquencyByPolicyId,
  getPaymentsByPolicyId,
  getPolicyById,
} from '../mocks/demo-data'

export function PolicyDetailPage() {
  const { policyId } = useParams()
  const policy = policyId ? getPolicyById(policyId) : undefined

  if (!policy) {
    return <Navigate to="/policies" replace />
  }

  const client = getClientById(policy.clientId)
  const relatedPayments = getPaymentsByPolicyId(policy.id)
  const policyDelinquency = getDelinquencyByPolicyId(policy.id)
  const relatedCommissions = getCommissionByPolicyId(policy.id)

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-sm text-slate-500">
                {policy.insurer} · {policy.line}
              </div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                {policy.product}
              </h2>
              <div className="mt-2 text-sm text-slate-500">{policy.policyNumber}</div>
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

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Metric label="Prima anual" value={formatCurrency(policy.premium)} />
            <Metric label="Suma asegurada" value={formatCurrency(policy.sumInsured)} />
            <Metric label="Inicio" value={formatShortDate(policy.startDate)} />
            <Metric label="Fin" value={formatShortDate(policy.endDate)} />
          </div>
        </Card>

        <Card>
          <h2 className="section-title">Ficha operacional</h2>
          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <InfoRow label="Activo asegurado" value={policy.insuredAsset} />
            <InfoRow label="Frecuencia de pago" value={policy.paymentFrequency} />
            <InfoRow label="Broker" value={policy.broker} />
            <InfoRow label="Cliente" value={client?.fullName ?? 'No disponible'} />
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
        <Card>
          <div className="mb-6">
            <h2 className="section-title">Coberturas</h2>
            <p className="section-subtitle">Desglose del producto asegurado para la demo del CRM</p>
          </div>
          <div className="space-y-3">
            {policy.coverages.map((coverage) => (
              <div key={coverage.name} className="surface-muted p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium text-slate-900">{coverage.name}</div>
                    <div className="mt-1 text-sm text-slate-500">Límite: {coverage.limit}</div>
                  </div>
                  <Badge tone="neutral">Deducible {coverage.deductible}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-6">
            <h2 className="section-title">Estado financiero</h2>
            <p className="section-subtitle">Pagos, comisiones y morosidad asociados a esta póliza</p>
          </div>

          <div className="space-y-4">
            <div className="surface-muted p-4">
              <div className="text-sm text-slate-500">Último pago</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">
                {relatedPayments[0] ? formatCurrency(relatedPayments[0].amount) : 'Sin registros'}
              </div>
            </div>
            <div className="surface-muted p-4">
              <div className="text-sm text-slate-500">Comisión acumulada</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">
                {formatCurrency(
                  relatedCommissions.reduce((total, item) => total + item.commissionAmount, 0),
                )}
              </div>
            </div>
            <div className="surface-muted p-4">
              <div className="text-sm text-slate-500">Saldo en mora</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">
                {policyDelinquency
                  ? formatCurrency(
                      policyDelinquency.current +
                        policyDelinquency.days30 +
                        policyDelinquency.days60 +
                        policyDelinquency.days90 +
                        policyDelinquency.days120Plus,
                    )
                  : 'B/. 0.00'}
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-muted p-4">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 text-xl font-semibold text-slate-900">{value}</div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-900">{value}</span>
    </div>
  )
}
