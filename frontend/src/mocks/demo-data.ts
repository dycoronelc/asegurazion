export type ClientStatus = 'Activo' | 'Prospecto' | 'En renovación'
export type PolicyStatus = 'Vigente' | 'Renovada' | 'Morosa' | 'Cancelada'
export type PolicyLine = 'Auto' | 'Incendio' | 'Vida' | 'Salud'

export interface Coverage {
  name: string
  limit: string
  deductible: string
}

export interface Client {
  id: string
  fullName: string
  document: string
  personType: 'Natural' | 'Jurídica'
  insurerCount: number
  policiesCount: number
  executive: string
  phone: string
  email: string
  city: string
  status: ClientStatus
  totalPremium: number
  riskScore: 'Bajo' | 'Medio' | 'Alto'
}

export interface Policy {
  id: string
  clientId: string
  policyNumber: string
  insurer: string
  line: PolicyLine
  product: string
  status: PolicyStatus
  startDate: string
  endDate: string
  premium: number
  sumInsured: number
  paymentFrequency: string
  broker: string
  insuredAsset: string
  coverages: Coverage[]
}

export interface Payment {
  id: string
  policyId: string
  policyNumber: string
  clientName: string
  insurer: string
  amount: number
  channel: string
  date: string
  commission: number
  status: 'Aplicado' | 'Pendiente'
}

export interface Delinquency {
  id: string
  policyId: string
  policyNumber: string
  clientName: string
  insurer: string
  current: number
  days30: number
  days60: number
  days90: number
  days120Plus: number
}

export interface Commission {
  id: string
  policyId: string
  policyNumber: string
  clientName: string
  insurer: string
  date: string
  premiumPaid: number
  commissionRate: number
  commissionAmount: number
}

export interface UafSource {
  id: string
  name: string
  category: 'Persona' | 'Entidad' | 'País'
}

export interface UafMatch {
  document: string
  name: string
  sources: string[]
  notes: string
}

export interface AutoQuoteRequest {
  customerName: string
  brand: string
  model: string
  year: string
  coverageType: 'Completa' | 'Daño a Terceros'
  preferredInsurer: string
}

export interface AutoQuoteOption {
  insurer: string
  popularity: number
  yearlyPrice: number
  includesTaxes: boolean
  coverageType: 'Completa' | 'Daño a Terceros'
  bodilyInjury: string
  propertyDamage: string
  medicalExpenses: string
  benefits: string[]
  accentClass: string
  recommended?: boolean
}

export const clients: Client[] = [
  {
    id: 'cli-001',
    fullName: 'Mariela Castillo Rojas',
    document: '8-765-1245',
    personType: 'Natural',
    insurerCount: 3,
    policiesCount: 4,
    executive: 'Daniel Pérez',
    phone: '6678-1245',
    email: 'mariela.castillo@email.com',
    city: 'Ciudad de Panamá',
    status: 'Activo',
    totalPremium: 4680,
    riskScore: 'Bajo',
  },
  {
    id: 'cli-002',
    fullName: 'Grupo Delta Logistics, S.A.',
    document: '1556234-1-702119 DV88',
    personType: 'Jurídica',
    insurerCount: 4,
    policiesCount: 6,
    executive: 'Andrea Gómez',
    phone: '210-4412',
    email: 'seguros@grupodelta.com',
    city: 'Costa del Este',
    status: 'En renovación',
    totalPremium: 28640,
    riskScore: 'Medio',
  },
  {
    id: 'cli-003',
    fullName: 'Carlos Mendieta León',
    document: '4-721-552',
    personType: 'Natural',
    insurerCount: 2,
    policiesCount: 3,
    executive: 'Daniel Pérez',
    phone: '6944-9251',
    email: 'cmendieta@gmail.com',
    city: 'San Francisco',
    status: 'Activo',
    totalPremium: 7240,
    riskScore: 'Medio',
  },
  {
    id: 'cli-004',
    fullName: 'Aurea Medical Center',
    document: '2389128-1-823004 DV51',
    personType: 'Jurídica',
    insurerCount: 2,
    policiesCount: 5,
    executive: 'Paola Núñez',
    phone: '305-8120',
    email: 'administracion@aureamed.com',
    city: 'Obarrio',
    status: 'Activo',
    totalPremium: 35210,
    riskScore: 'Alto',
  },
  {
    id: 'cli-005',
    fullName: 'Sofía Navarro Boyd',
    document: '8-912-1402',
    personType: 'Natural',
    insurerCount: 1,
    policiesCount: 1,
    executive: 'Paola Núñez',
    phone: '6522-1088',
    email: 'sofiaboyd@outlook.com',
    city: 'Clayton',
    status: 'Prospecto',
    totalPremium: 1890,
    riskScore: 'Bajo',
  },
]

export const policies: Policy[] = [
  {
    id: 'pol-001',
    clientId: 'cli-001',
    policyNumber: 'MAP-04030316999',
    insurer: 'MAPFRE',
    line: 'Auto',
    product: 'Auto Particular Full',
    status: 'Vigente',
    startDate: '2025-11-19',
    endDate: '2026-11-19',
    premium: 980,
    sumInsured: 36550,
    paymentFrequency: 'Mensual',
    broker: 'AseguraZion',
    insuredAsset: 'Jeep Grand Cherokee 2019',
    coverages: [
      { name: 'Daños propios', limit: 'B/. 36,550', deductible: '2%' },
      { name: 'Lesiones corporales', limit: 'B/. 100,000 / 300,000', deductible: 'N/A' },
      { name: 'Propiedad ajena', limit: 'B/. 50,000', deductible: 'N/A' },
    ],
  },
  {
    id: 'pol-002',
    clientId: 'cli-001',
    policyNumber: 'SUR-02-48-0792492-0',
    insurer: 'SURA',
    line: 'Vida',
    product: 'Vida Individual Plus',
    status: 'Renovada',
    startDate: '2025-09-23',
    endDate: '2026-09-23',
    premium: 1240,
    sumInsured: 150000,
    paymentFrequency: 'Anual',
    broker: 'AseguraZion',
    insuredAsset: 'Vida individual',
    coverages: [
      { name: 'Vida básica', limit: 'B/. 150,000', deductible: 'N/A' },
      { name: 'Muerte accidental', limit: 'B/. 50,000', deductible: 'N/A' },
    ],
  },
  {
    id: 'pol-003',
    clientId: 'cli-002',
    policyNumber: 'OPT-02-01-55879-1',
    insurer: 'Óptima',
    line: 'Auto',
    product: 'Flota Ejecutiva',
    status: 'Morosa',
    startDate: '2025-09-17',
    endDate: '2026-09-17',
    premium: 6480,
    sumInsured: 112500,
    paymentFrequency: 'Mensual',
    broker: 'AseguraZion',
    insuredAsset: 'Flota 4 vehículos',
    coverages: [
      { name: 'Cobertura completa', limit: 'B/. 112,500', deductible: '2%' },
      { name: 'Responsabilidad civil', limit: 'B/. 300,000', deductible: 'N/A' },
    ],
  },
  {
    id: 'pol-004',
    clientId: 'cli-002',
    policyNumber: 'INT-0300-45017',
    insurer: 'Internacional',
    line: 'Incendio',
    product: 'Multirriesgo Comercial',
    status: 'Vigente',
    startDate: '2025-08-01',
    endDate: '2026-08-01',
    premium: 8340,
    sumInsured: 480000,
    paymentFrequency: 'Trimestral',
    broker: 'AseguraZion',
    insuredAsset: 'Bodega principal y contenido',
    coverages: [
      { name: 'Incendio y rayo', limit: 'B/. 480,000', deductible: '1%' },
      { name: 'Terremoto', limit: 'B/. 480,000', deductible: '2%' },
      { name: 'Robo', limit: 'B/. 125,000', deductible: 'B/. 500' },
    ],
  },
  {
    id: 'pol-005',
    clientId: 'cli-003',
    policyNumber: 'ANC-14B-35425',
    insurer: 'Ancón',
    line: 'Salud',
    product: 'Salud Internacional',
    status: 'Vigente',
    startDate: '2025-06-15',
    endDate: '2026-06-15',
    premium: 3990,
    sumInsured: 750000,
    paymentFrequency: 'Mensual',
    broker: 'AseguraZion',
    insuredAsset: 'Cobertura familiar',
    coverages: [
      { name: 'Hospitalización', limit: 'B/. 750,000', deductible: 'B/. 250' },
      { name: 'Maternidad', limit: 'B/. 8,000', deductible: 'N/A' },
      { name: 'Urgencias', limit: '100%', deductible: 'N/A' },
    ],
  },
  {
    id: 'pol-006',
    clientId: 'cli-004',
    policyNumber: 'MAP-WS002779-8834',
    insurer: 'MAPFRE',
    line: 'Incendio',
    product: 'Patrimonial Corporativo',
    status: 'Vigente',
    startDate: '2025-05-01',
    endDate: '2026-05-01',
    premium: 15280,
    sumInsured: 1200000,
    paymentFrequency: 'Mensual',
    broker: 'AseguraZion',
    insuredAsset: 'Clínica y equipamiento médico',
    coverages: [
      { name: 'Incendio edificio', limit: 'B/. 900,000', deductible: '1%' },
      { name: 'Equipo médico', limit: 'B/. 300,000', deductible: 'B/. 1,000' },
    ],
  },
  {
    id: 'pol-007',
    clientId: 'cli-005',
    policyNumber: 'REG-AUTO-0051',
    insurer: 'La Regional',
    line: 'Auto',
    product: 'Auto Platinum',
    status: 'Cancelada',
    startDate: '2024-12-01',
    endDate: '2025-12-01',
    premium: 1890,
    sumInsured: 21000,
    paymentFrequency: 'Mensual',
    broker: 'AseguraZion',
    insuredAsset: 'Toyota Corolla Cross 2022',
    coverages: [
      { name: 'Cobertura completa', limit: 'B/. 21,000', deductible: '2%' },
      { name: 'Gastos médicos', limit: 'B/. 5,000', deductible: 'N/A' },
    ],
  },
]

export const payments: Payment[] = [
  {
    id: 'pay-001',
    policyId: 'pol-001',
    policyNumber: 'MAP-04030316999',
    clientName: 'Mariela Castillo Rojas',
    insurer: 'MAPFRE',
    amount: 92,
    channel: 'Tarjeta',
    date: '2026-03-02',
    commission: 18.4,
    status: 'Aplicado',
  },
  {
    id: 'pay-002',
    policyId: 'pol-002',
    policyNumber: 'SUR-02-48-0792492-0',
    clientName: 'Mariela Castillo Rojas',
    insurer: 'SURA',
    amount: 1240,
    channel: 'Transferencia',
    date: '2026-02-18',
    commission: 186,
    status: 'Aplicado',
  },
  {
    id: 'pay-003',
    policyId: 'pol-003',
    policyNumber: 'OPT-02-01-55879-1',
    clientName: 'Grupo Delta Logistics, S.A.',
    insurer: 'Óptima',
    amount: 540,
    channel: 'Remesa',
    date: '2026-02-11',
    commission: 81,
    status: 'Pendiente',
  },
  {
    id: 'pay-004',
    policyId: 'pol-004',
    policyNumber: 'INT-0300-45017',
    clientName: 'Grupo Delta Logistics, S.A.',
    insurer: 'Internacional',
    amount: 2085,
    channel: 'Cheque',
    date: '2026-01-29',
    commission: 312.75,
    status: 'Aplicado',
  },
  {
    id: 'pay-005',
    policyId: 'pol-005',
    policyNumber: 'ANC-14B-35425',
    clientName: 'Carlos Mendieta León',
    insurer: 'Ancón',
    amount: 332.5,
    channel: 'ACH',
    date: '2026-03-06',
    commission: 49.88,
    status: 'Aplicado',
  },
  {
    id: 'pay-006',
    policyId: 'pol-006',
    policyNumber: 'MAP-WS002779-8834',
    clientName: 'Aurea Medical Center',
    insurer: 'MAPFRE',
    amount: 1273.33,
    channel: 'Transferencia',
    date: '2026-03-07',
    commission: 191,
    status: 'Aplicado',
  },
]

export const delinquencies: Delinquency[] = [
  {
    id: 'del-001',
    policyId: 'pol-003',
    policyNumber: 'OPT-02-01-55879-1',
    clientName: 'Grupo Delta Logistics, S.A.',
    insurer: 'Óptima',
    current: 540,
    days30: 540,
    days60: 0,
    days90: 0,
    days120Plus: 0,
  },
  {
    id: 'del-002',
    policyId: 'pol-007',
    policyNumber: 'REG-AUTO-0051',
    clientName: 'Sofía Navarro Boyd',
    insurer: 'La Regional',
    current: 0,
    days30: 0,
    days60: 120,
    days90: 180,
    days120Plus: 265,
  },
]

export const commissions: Commission[] = [
  {
    id: 'com-001',
    policyId: 'pol-001',
    policyNumber: 'MAP-04030316999',
    clientName: 'Mariela Castillo Rojas',
    insurer: 'MAPFRE',
    date: '2026-03-02',
    premiumPaid: 92,
    commissionRate: 20,
    commissionAmount: 18.4,
  },
  {
    id: 'com-002',
    policyId: 'pol-002',
    policyNumber: 'SUR-02-48-0792492-0',
    clientName: 'Mariela Castillo Rojas',
    insurer: 'SURA',
    date: '2026-02-18',
    premiumPaid: 1240,
    commissionRate: 15,
    commissionAmount: 186,
  },
  {
    id: 'com-003',
    policyId: 'pol-004',
    policyNumber: 'INT-0300-45017',
    clientName: 'Grupo Delta Logistics, S.A.',
    insurer: 'Internacional',
    date: '2026-01-29',
    premiumPaid: 2085,
    commissionRate: 15,
    commissionAmount: 312.75,
  },
  {
    id: 'com-004',
    policyId: 'pol-005',
    policyNumber: 'ANC-14B-35425',
    clientName: 'Carlos Mendieta León',
    insurer: 'Ancón',
    date: '2026-03-06',
    premiumPaid: 332.5,
    commissionRate: 15,
    commissionAmount: 49.88,
  },
  {
    id: 'com-005',
    policyId: 'pol-006',
    policyNumber: 'MAP-WS002779-8834',
    clientName: 'Aurea Medical Center',
    insurer: 'MAPFRE',
    date: '2026-03-07',
    premiumPaid: 1273.33,
    commissionRate: 15,
    commissionAmount: 191,
  },
]

export const dashboardTrend = [
  { month: 'Oct', cartera: 48, comisiones: 10 },
  { month: 'Nov', cartera: 53, comisiones: 11.5 },
  { month: 'Dic', cartera: 57, comisiones: 12.1 },
  { month: 'Ene', cartera: 61, comisiones: 13.4 },
  { month: 'Feb', cartera: 66, comisiones: 14.2 },
  { month: 'Mar', cartera: 71, comisiones: 15.8 },
]

export const delinquencyByInsurer = [
  { insurer: 'Óptima', amount: 1080 },
  { insurer: 'La Regional', amount: 565 },
  { insurer: 'MAPFRE', amount: 0 },
  { insurer: 'SURA', amount: 0 },
]

export const integrationStatus = [
  { name: 'MAPFRE', status: 'Conectable', detail: 'Documentación completa y token identificado.' },
  { name: 'SURA', status: 'Conectable', detail: 'OAuth y operaciones documentadas.' },
  { name: 'Internacional', status: 'Conectable', detail: 'Servicios SOAP de cartera y cotización auto.' },
  { name: 'Óptima', status: 'Conectable', detail: 'SOAP cartera, auto y vida.' },
  { name: 'Ancón', status: 'Pendiente credenciales', detail: 'API documentada, falta acceso operativo.' },
  { name: 'Acerta', status: 'Pendiente documentación', detail: 'La documentación actual no es utilizable.' },
  { name: 'La Regional', status: 'Parcial', detail: 'Cotizador documentado; falta cartera completa.' },
  { name: 'ASSA', status: 'Parcial', detail: 'Autenticación conocida, faltan URIs finales.' },
]

export const uafSources: UafSource[] = [
  { id: 'onu-1988', name: 'Listado ONU 1988', category: 'Persona' },
  { id: 'onu-1267', name: 'Listado ONU 1267', category: 'Persona' },
  { id: 'buscador-onu', name: 'Buscador Lista ONU', category: 'Persona' },
  { id: 'uk', name: 'Listado Reino Unido', category: 'Persona' },
  { id: 'canada', name: 'Listado Canadá', category: 'Persona' },
  { id: 'ofac', name: 'Listado OFAC', category: 'Persona' },
  { id: 'res-02-2018', name: 'Resolución 02-2018', category: 'Entidad' },
  { id: 'gafi', name: 'Lista de Países en Riesgo de BC/FT del GAFI', category: 'País' },
]

const uafMatches: UafMatch[] = [
  {
    document: '8-765-1245',
    name: 'Mariela Castillo Rojas',
    sources: [],
    notes: 'Sin coincidencias detectadas en la simulación.',
  },
  {
    document: '4-721-552',
    name: 'Carlos Mendieta León',
    sources: ['Listado OFAC'],
    notes: 'Coincidencia parcial usada para pruebas de cumplimiento y revisión manual.',
  },
  {
    document: '1556234-1-702119 DV88',
    name: 'Grupo Delta Logistics, S.A.',
    sources: ['Resolución 02-2018', 'Listado Reino Unido'],
    notes: 'Entidad marcada en listas simuladas para demostrar alertas múltiples.',
  },
  {
    document: 'PAIS-RIESGO-IRN',
    name: 'República de Irán',
    sources: ['Lista de Países en Riesgo de BC/FT del GAFI'],
    notes: 'Ejemplo de coincidencia por jurisdicción en la lista de países de riesgo.',
  },
]

export function getClientById(id: string) {
  return clients.find((client) => client.id === id)
}

export function getPolicyById(id: string) {
  return policies.find((policy) => policy.id === id)
}

export function getPoliciesByClientId(clientId: string) {
  return policies.filter((policy) => policy.clientId === clientId)
}

export function getPaymentsByPolicyId(policyId: string) {
  return payments.filter((payment) => payment.policyId === policyId)
}

export function getDelinquencyByPolicyId(policyId: string) {
  return delinquencies.find((entry) => entry.policyId === policyId)
}

export function getCommissionByPolicyId(policyId: string) {
  return commissions.filter((entry) => entry.policyId === policyId)
}

export function runUafValidation(input: { document: string; name: string }) {
  const normalizedDocument = input.document.trim().toLowerCase()
  const normalizedName = input.name.trim().toLowerCase()

  const match = uafMatches.find((entry) => {
    const sameDocument = entry.document.toLowerCase() === normalizedDocument
    const sameName = entry.name.toLowerCase() === normalizedName
    const partialName = normalizedName.length > 3 && entry.name.toLowerCase().includes(normalizedName)
    return sameDocument || sameName || partialName
  })

  const checkedAt = new Date().toISOString()

  if (!match) {
    return {
      status: 'No encontrado' as const,
      matchedSources: [] as string[],
      checkedSources: uafSources.map((source) => source.name),
      checkedAt,
      notes:
        'No se encontraron coincidencias en la simulación de listas UAF. Se recomienda conservar evidencia de la validación.',
      validationCode: `UAF-${Date.now()}-CLEAR`,
    }
  }

  return {
    status: 'Coincidencia detectada' as const,
    matchedSources: match.sources,
    checkedSources: uafSources.map((source) => source.name),
    checkedAt,
    notes: match.notes,
    validationCode: `UAF-${Date.now()}-MATCH`,
  }
}

export function generateAutoQuotes(request: AutoQuoteRequest): AutoQuoteOption[] {
  const yearNumber = Number(request.year) || 2022
  const ageFactor = Math.max(0, 2026 - yearNumber)
  const coverageBase = request.coverageType === 'Completa' ? 118 : 82
  const preferred = request.preferredInsurer.trim().toLowerCase()

  const quotes: AutoQuoteOption[] = [
    {
      insurer: 'SURA',
      popularity: 754,
      yearlyPrice: coverageBase + ageFactor * 1.95,
      includesTaxes: true,
      coverageType: request.coverageType,
      bodilyInjury: request.coverageType === 'Completa' ? '$10,000 / 30,000' : '$5,000 / 10,000',
      propertyDamage: request.coverageType === 'Completa' ? '$5,000' : '$3,000',
      medicalExpenses: request.coverageType === 'Completa' ? '$2,500' : '$1,000',
      benefits: ['Ambulancia', 'Asistencia vial', 'Grúa'],
      accentClass: 'bg-cyan-500',
    },
    {
      insurer: 'Óptima',
      popularity: 295,
      yearlyPrice: coverageBase + 3.35 + ageFactor * 2.1,
      includesTaxes: true,
      coverageType: request.coverageType,
      bodilyInjury: request.coverageType === 'Completa' ? '$10,000 / 30,000' : '$5,000 / 10,000',
      propertyDamage: '$5,000',
      medicalExpenses: request.coverageType === 'Completa' ? '$2,500' : '$1,500',
      benefits: ['Ambulancia', 'Asistencia vial', 'Grúa'],
      accentClass: 'bg-violet-100',
    },
    {
      insurer: 'La Regional',
      popularity: 135,
      yearlyPrice: coverageBase + 12.72 + ageFactor * 2.5,
      includesTaxes: true,
      coverageType: request.coverageType,
      bodilyInjury: request.coverageType === 'Completa' ? '$20,000 / 30,000' : '$10,000 / 20,000',
      propertyDamage: request.coverageType === 'Completa' ? '$10,000' : '$5,000',
      medicalExpenses: request.coverageType === 'Completa' ? '$5,000' : '$2,000',
      benefits: ['Asistencia vial', 'Grúa'],
      accentClass: 'bg-violet-100',
    },
  ]

  const preferredMatch = quotes.find(
    (quote) => quote.insurer.toLowerCase() === preferred.toLowerCase(),
  )
  const lowest = quotes.reduce((best, current) =>
    current.yearlyPrice < best.yearlyPrice ? current : best,
  )

  if (preferredMatch) {
    preferredMatch.recommended = true
  } else {
    lowest.recommended = true
  }

  return quotes.map((quote) => ({
    ...quote,
    yearlyPrice: Number(quote.yearlyPrice.toFixed(2)),
  }))
}
