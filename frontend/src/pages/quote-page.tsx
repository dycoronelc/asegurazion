import { Car, HeartHandshake, LoaderCircle, ShieldCheck, Truck, UserRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { formatCurrency } from '../lib/utils'
import { generateAutoQuotes, type AutoQuoteRequest } from '../mocks/demo-data'
import { Badge, Button, Card, Input } from '../components/ui/primitives'

const insurers = ['Sin preferencia', 'SURA', 'Óptima', 'La Regional', 'MAPFRE', 'Internacional']

export function QuotePage() {
  const [customerName, setCustomerName] = useState('Mariela Castillo Rojas')
  const [brand, setBrand] = useState('Toyota')
  const [model, setModel] = useState('Corolla Cross')
  const [year, setYear] = useState('2022')
  const [coverageType, setCoverageType] = useState<'Completa' | 'Daño a Terceros'>('Completa')
  const [preferredInsurer, setPreferredInsurer] = useState('Sin preferencia')
  const [submittedState, setSubmittedState] = useState<AutoQuoteRequest>({
    customerName: 'Mariela Castillo Rojas',
    brand: 'Toyota',
    model: 'Corolla Cross',
    year: '2022',
    coverageType: 'Completa' as const,
    preferredInsurer: 'Sin preferencia',
  })
  const [isSearching, setIsSearching] = useState(false)
  const [hasResults, setHasResults] = useState(false)

  const quotes = useMemo(() => generateAutoQuotes(submittedState), [submittedState])

  useEffect(() => {
    if (!isSearching) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setIsSearching(false)
      setHasResults(true)
    }, 5000)

    return () => window.clearTimeout(timer)
  }, [isSearching])

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-50 p-3 text-brand-600">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <h2 className="section-title">Cotizador</h2>
              <p className="section-subtitle">
                Simulación de cotización comparativa para pólizas de auto.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field label="Nombre del cliente">
              <Input value={customerName} onChange={(event) => setCustomerName(event.target.value)} />
            </Field>
            <Field label="Marca">
              <Input value={brand} onChange={(event) => setBrand(event.target.value)} />
            </Field>
            <Field label="Modelo">
              <Input value={model} onChange={(event) => setModel(event.target.value)} />
            </Field>
            <Field label="Año">
              <Input value={year} onChange={(event) => setYear(event.target.value)} />
            </Field>
            <Field label="Tipo de cobertura">
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
                value={coverageType}
                onChange={(event) =>
                  setCoverageType(event.target.value as 'Completa' | 'Daño a Terceros')
                }
              >
                <option value="Completa">Completa</option>
                <option value="Daño a Terceros">Daño a Terceros</option>
              </select>
            </Field>
            <Field label="Aseguradora preferida">
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
                value={preferredInsurer}
                onChange={(event) => setPreferredInsurer(event.target.value)}
              >
                {insurers.map((insurer) => (
                  <option key={insurer} value={insurer}>
                    {insurer}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              onClick={() => {
                setSubmittedState({
                  customerName,
                  brand,
                  model,
                  year,
                  coverageType,
                  preferredInsurer,
                })
                setHasResults(false)
                setIsSearching(true)
              }}
            >
              Generar cotizaciones
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setCustomerName('Sofía Navarro Boyd')
                setBrand('Hyundai')
                setModel('Creta')
                setYear('2021')
                setCoverageType('Daño a Terceros')
                setPreferredInsurer('La Regional')
                setSubmittedState({
                  customerName: 'Sofía Navarro Boyd',
                  brand: 'Hyundai',
                  model: 'Creta',
                  year: '2021',
                  coverageType: 'Daño a Terceros',
                  preferredInsurer: 'La Regional',
                })
                setHasResults(false)
                setIsSearching(true)
              }}
            >
              Cargar ejemplo
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="section-title">Resumen de solicitud</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <SummaryItem
              icon={<UserRound className="h-4 w-4" />}
              label="Cliente"
              value={submittedState.customerName}
            />
            <SummaryItem
              icon={<Car className="h-4 w-4" />}
              label="Vehículo"
              value={`${submittedState.brand} ${submittedState.model}`}
            />
            <SummaryItem
              icon={<Truck className="h-4 w-4" />}
              label="Año"
              value={submittedState.year}
            />
            <SummaryItem
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Cobertura"
              value={submittedState.coverageType}
            />
          </div>

          <div className="mt-6 rounded-3xl border border-brand-100 bg-brand-50/60 p-4 text-sm text-slate-600">
            {submittedState.preferredInsurer === 'Sin preferencia'
              ? 'No se indicó aseguradora preferida. El sistema destacará la opción más competitiva.'
              : `La aseguradora preferida es ${submittedState.preferredInsurer}. El comparador la resaltará dentro de las propuestas.`}
          </div>
        </Card>
      </section>

      {isSearching ? (
        <Card className="py-12 text-center">
          <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-brand-500" />
          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">
            Buscando las mejores propuestas
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Estamos consultando aseguradoras y preparando un comparativo para el cliente.
          </p>
        </Card>
      ) : null}

      {hasResults ? (
        <section className="space-y-4">
          <div>
            <h2 className="section-title">Propuestas comparativas</h2>
            <p className="section-subtitle">
              Resultado visual de tres aseguradoras para una presentación al cliente.
            </p>
          </div>

          <div className="grid gap-5 xl:grid-cols-3">
            {quotes.map((quote) => (
              <QuoteCard
                key={quote.insurer}
                customerName={submittedState.customerName}
                vehicle={`${submittedState.brand} ${submittedState.model} ${submittedState.year}`}
                quote={quote}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  )
}

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="surface-muted p-4">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-base font-semibold text-slate-900">{value}</div>
    </div>
  )
}

function QuoteCard({
  quote,
  customerName,
  vehicle,
}: {
  quote: ReturnType<typeof generateAutoQuotes>[number]
  customerName: string
  vehicle: string
}) {
  const insurerLogo = {
    SURA: 'sura',
    'Óptima': 'óptima',
    'La Regional': 'La Regional',
  }[quote.insurer]

  return (
    <div
      className={`overflow-hidden rounded-[2rem] border bg-white shadow-soft ${
        quote.recommended ? 'border-brand-400 ring-2 ring-brand-200' : 'border-slate-200'
      }`}
    >
      <div className={`${quote.accentClass} px-5 py-4 text-white`}>
        <div className="h-4" />
      </div>

      <div className="px-6 py-6">
        <div className="text-center">
          <div className="text-4xl font-extrabold tracking-tight text-slate-800">{insurerLogo}</div>
          <div className="mt-3 text-5xl font-extrabold tracking-tight text-slate-900">
            {formatCurrency(quote.yearlyPrice)}
          </div>
          <div className="mt-1 text-sm text-slate-500">Incluye ITBMS</div>
          <div className="text-sm text-slate-500">Vigencia por 1 año</div>
        </div>

        <div className="mt-6 text-center">
          <div className="text-sm font-semibold text-slate-800">Coberturas por accidente</div>
        </div>

        <div className="mt-4 space-y-4">
          <CoverageBar label="Lesiones Corporales" value={quote.bodilyInjury} activeSegments={2} />
          <CoverageBar label="Daños a Propiedad Ajena" value={quote.propertyDamage} activeSegments={1} />
          <CoverageBar label="Gastos Médicos" value={quote.medicalExpenses} activeSegments={2} />
        </div>

        <div className="mt-6 text-center">
          <div className="text-sm font-semibold text-slate-800">Beneficios</div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {['Ambulancia', 'Asistencia Vial', 'Grúa'].map((benefit) => (
              <div
                key={benefit}
                className={`rounded-2xl px-2 py-3 text-center text-xs ${
                  quote.benefits.includes(benefit)
                    ? 'bg-brand-50 text-brand-700'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <HeartHandshake className="mx-auto h-5 w-5" />
                <div className="mt-2">{benefit}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-2 rounded-2xl bg-slate-50 p-4 text-xs text-slate-500">
          <div>Cliente: {customerName}</div>
          <div>Vehículo: {vehicle}</div>
          <div>Cobertura: {quote.coverageType}</div>
        </div>

        {quote.recommended ? (
          <div className="mt-4">
            <Badge tone="brand" className="w-full justify-center rounded-2xl py-2 text-sm">
              Opción destacada
            </Badge>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function CoverageBar({
  label,
  value,
  activeSegments,
}: {
  label: string
  value: string
  activeSegments: number
}) {
  return (
    <div>
      <div className="mb-2 text-xs font-medium text-slate-500">{label}</div>
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((segment) => (
          <div
            key={segment}
            className={`flex h-10 flex-1 items-center justify-center rounded-xl text-xs font-semibold ${
              segment < activeSegments ? 'bg-emerald-400 text-white' : 'bg-slate-200 text-slate-400'
            }`}
          >
            {segment === activeSegments - 1 ? value : ''}
          </div>
        ))}
      </div>
    </div>
  )
}
