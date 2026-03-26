import { Activity, BadgeDollarSign, CircleDollarSign, ShieldAlert } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import {
  clients,
  commissions,
  dashboardTrend,
  delinquencyByInsurer,
  policies,
} from '../mocks/demo-data'
import { formatCurrency } from '../lib/utils'
import { Badge, Card } from '../components/ui/primitives'

const summary = [
  {
    label: 'Prima administrada',
    value: formatCurrency(policies.reduce((total, item) => total + item.premium, 0)),
    icon: CircleDollarSign,
    tone: 'brand' as const,
  },
  {
    label: 'Clientes activos',
    value: String(clients.filter((client) => client.status !== 'Prospecto').length),
    icon: Activity,
    tone: 'success' as const,
  },
  {
    label: 'Comisiones acumuladas',
    value: formatCurrency(commissions.reduce((total, item) => total + item.commissionAmount, 0)),
    icon: BadgeDollarSign,
    tone: 'neutral' as const,
  },
  {
    label: 'Morosidad abierta',
    value: formatCurrency(delinquencyByInsurer.reduce((total, item) => total + item.amount, 0)),
    icon: ShieldAlert,
    tone: 'warning' as const,
  },
]

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <Card key={item.label} className="overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-500">{item.label}</div>
                <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                  {item.value}
                </div>
              </div>
              <div className="rounded-2xl bg-brand-50 p-3 text-brand-600">
                <item.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <Badge tone={item.tone}>
                {item.label === 'Morosidad abierta' ? 'Monitorear hoy' : 'Meta trimestral en línea'}
              </Badge>
            </div>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr,0.95fr]">
        <Card className="p-0">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="section-title">Crecimiento de cartera y comisiones</h2>
              <p className="section-subtitle">Evolución comercial del corredor en el último semestre</p>
            </div>
            <Badge tone="brand">Demo</Badge>
          </div>
          <div className="h-[340px] px-2 py-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="cartera"
                  stroke="#ff6b0b"
                  strokeWidth={3}
                  dot={{ fill: '#ff6b0b', strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="comisiones"
                  stroke="#0f172a"
                  strokeWidth={3}
                  dot={{ fill: '#0f172a', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-0">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="section-title">Morosidad por aseguradora</h2>
            <p className="section-subtitle">Distribución para priorizar seguimiento comercial</p>
          </div>
          <div className="h-[340px] px-2 py-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={delinquencyByInsurer}
                  dataKey="amount"
                  nameKey="insurer"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                >
                  {delinquencyByInsurer.map((entry, index) => (
                    <Cell
                      key={entry.insurer}
                      fill={['#ff6b0b', '#ff9f5a', '#1e293b', '#cbd5e1'][index % 4]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <Card className="p-0">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="section-title">Pólizas por aseguradora</h2>
            <p className="section-subtitle">Visual de concentración del portafolio administrado</p>
          </div>
          <div className="h-[320px] px-2 py-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={Object.entries(
                  policies.reduce<Record<string, number>>((acc, policy) => {
                    acc[policy.insurer] = (acc[policy.insurer] || 0) + 1
                    return acc
                  }, {}),
                ).map(([insurer, count]) => ({ insurer, count }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="insurer" stroke="#64748b" />
                <YAxis stroke="#64748b" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[14, 14, 0, 0]} fill="#ff6b0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="section-title">Prioridades del día</h2>
              <p className="section-subtitle">Acciones sugeridas para la mesa comercial</p>
            </div>
            <Badge tone="warning">4 alertas</Badge>
          </div>

          <div className="mt-6 space-y-4">
            {[
              'Dar seguimiento a la morosidad de Grupo Delta Logistics.',
              'Preparar renovación de Vida para Mariela Castillo.',
              'Validar cancelación y nueva oportunidad para Sofía Navarro.',
              'Convertir prospecto de Salud internacional a propuesta formal.',
            ].map((item) => (
              <div key={item} className="surface-muted px-4 py-3 text-sm text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  )
}
