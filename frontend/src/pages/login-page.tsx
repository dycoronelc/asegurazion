import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useAppStore } from '../store/app-store'
import { Button, Card, Input } from '../components/ui/primitives'
import { Brand } from '../components/layout/brand'

export function LoginPage() {
  const navigate = useNavigate()
  const login = useAppStore((state) => state.login)

  return (
    <div className="min-h-screen bg-brand-grid px-4 py-6 md:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <section className="surface relative overflow-hidden p-8 md:p-10">
          <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-brand-200/30 blur-3xl" />
          <Brand />
          <div className="mt-10 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 ring-1 ring-brand-100">
              <Sparkles className="h-4 w-4" />
              Experiencia premium para corredores de seguros
            </div>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-slate-900">
              Consolida cartera, seguimiento y rentabilidad en una sola vista.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              AseguraZion es el CRM donde el corredor ve clientes, pólizas, pagos, morosidad
              y comisiones con una experiencia moderna lista para presentación.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ['6', 'Aseguradoras listas para integrar'],
              ['19', 'Pólizas mock homologadas para demo'],
              ['100%', 'Enfoque interno para corredor'],
            ].map(([value, label]) => (
              <div key={label} className="surface-muted orange-ring p-4">
                <div className="text-3xl font-semibold tracking-tight text-slate-900">{value}</div>
                <div className="mt-1 text-sm text-slate-500">{label}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-3">
            {[
              'Vista consolidada de clientes y pólizas multiaseguradora',
              'Monitoreo de pagos, morosidad y comisiones',
              'Diseño preparado para evolucionar a integraciones reales',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-slate-600">
                <CheckCircle2 className="h-5 w-5 text-brand-500" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <Card className="flex flex-col justify-center p-8 md:p-10">
          <div className="mx-auto w-full max-w-md">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-brand-500 p-3 text-white shadow-glow">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm text-slate-500">Ingreso seguro</div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                  Accede a tu CRM
                </h2>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Usuario</label>
                <Input defaultValue="corredor@asegurazion.com" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Contraseña</label>
                <Input defaultValue="demo-asegurazion" type="password" />
              </div>
            </div>

            <Button
              className="mt-6 w-full justify-between"
              onClick={() => {
                login()
                navigate('/dashboard')
              }}
            >
              Entrar al prototipo
              <ArrowRight className="h-4 w-4" />
            </Button>

            <p className="mt-4 text-sm text-slate-500">
              Demo interna orientada a validar experiencia visual, estructura CRM y narrativa
              comercial.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
