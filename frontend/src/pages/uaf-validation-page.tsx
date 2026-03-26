import { SearchCheck, ShieldAlert, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

import { formatShortDate } from '../lib/utils'
import { runUafValidation, uafSources } from '../mocks/demo-data'
import { Badge, Button, Card, Input } from '../components/ui/primitives'

export function UafValidationPage() {
  const [document, setDocument] = useState('4-721-552')
  const [name, setName] = useState('Carlos Mendieta León')
  const [submittedAt, setSubmittedAt] = useState<number>(Date.now())

  const result = useMemo(() => runUafValidation({ document, name }), [document, name, submittedAt])

  const qrPayload = JSON.stringify({
    module: 'Validacion UAF',
    document,
    name,
    result: result.status,
    code: result.validationCode,
    checkedAt: result.checkedAt,
  })

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-50 p-3 text-brand-600">
              <SearchCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="section-title">Validación UAF</h2>
              <p className="section-subtitle">
                Simulación de búsqueda en las listas publicadas por la UAF de Panamá.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Identificación
              </label>
              <Input
                value={document}
                onChange={(event) => setDocument(event.target.value)}
                placeholder="Cédula, pasaporte o RUC"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Nombre</label>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nombre completo o razón social"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={() => setSubmittedAt(Date.now())}>Buscar en listas UAF</Button>
            <Button
              variant="secondary"
              onClick={() => {
                setDocument('8-765-1245')
                setName('Mariela Castillo Rojas')
                setSubmittedAt(Date.now())
              }}
            >
              Probar caso sin coincidencias
            </Button>
          </div>

          <div className="mt-6 rounded-3xl border border-amber-100 bg-amber-50/70 p-4 text-sm text-slate-600">
            Esta vista es una <span className="font-semibold">simulación de cumplimiento</span>
            basada en los listados visibles en la UAF: ONU 1988, ONU 1267, Buscador ONU,
            Reino Unido, Canadá, OFAC, Resolución 02-2018 y lista de países de riesgo del GAFI.
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="section-title">Resultado de la validación</h2>
              <p className="section-subtitle">Código de control y evidencia de la consulta</p>
            </div>
            <Badge tone={result.status === 'No encontrado' ? 'success' : 'warning'}>
              {result.status}
            </Badge>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-[1fr,auto]">
            <div className="space-y-4">
              <div className="surface-muted p-4">
                <div className="text-sm text-slate-500">Validación</div>
                <div className="mt-2 flex items-center gap-2 text-lg font-semibold text-slate-900">
                  {result.status === 'No encontrado' ? (
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <ShieldAlert className="h-5 w-5 text-amber-600" />
                  )}
                  {result.status}
                </div>
              </div>

              <div className="surface-muted p-4">
                <div className="text-sm text-slate-500">Código de validación</div>
                <div className="mt-2 break-all text-sm font-semibold text-slate-900">
                  {result.validationCode}
                </div>
              </div>

              <div className="surface-muted p-4">
                <div className="text-sm text-slate-500">Observaciones</div>
                <p className="mt-2 text-sm text-slate-700">{result.notes}</p>
              </div>
            </div>

            <div className="surface-muted flex flex-col items-center gap-3 p-4">
              <QRCodeSVG
                value={qrPayload}
                size={152}
                bgColor="#ffffff"
                fgColor="#0f172a"
                level="M"
                includeMargin
              />
              <div className="text-center text-xs text-slate-500">
                QR de evidencia
                <br />
                {formatShortDate(result.checkedAt)}
              </div>
            </div>
          </div>
        </Card>
      </section>

      <Card>
        <div className="mb-6">
          <h2 className="section-title">Listas revisadas</h2>
          <p className="section-subtitle">
            Fuentes incluidas en la simulación, alineadas con los listados visibles en la UAF.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {uafSources.map((source) => {
            const matched = result.matchedSources.includes(source.name)

            return (
              <div key={source.id} className="surface-muted p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold text-slate-900">{source.name}</div>
                    <div className="mt-1 text-sm text-slate-500">{source.category}</div>
                  </div>
                  <Badge tone={matched ? 'warning' : 'success'}>
                    {matched ? 'Coincidencia' : 'Revisado'}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
