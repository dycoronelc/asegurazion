import { integrationStatus } from '../mocks/demo-data'
import { Badge, Card } from '../components/ui/primitives'

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-6">
          <h2 className="section-title">Integraciones</h2>
          <p className="section-subtitle">
            Resumen ejecutivo de aseguradoras para la siguiente etapa del proyecto.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {integrationStatus.map((integration) => (
            <div key={integration.name} className="surface-muted p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold text-slate-900">{integration.name}</div>
                  <p className="mt-2 text-sm text-slate-500">{integration.detail}</p>
                </div>
                <Badge
                  tone={
                    integration.status === 'Conectable'
                      ? 'success'
                      : integration.status === 'Parcial'
                        ? 'warning'
                        : 'brand'
                  }
                >
                  {integration.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
