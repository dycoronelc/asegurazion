import {
  BarChart3,
  CreditCard,
  FileText,
  LayoutDashboard,
  Menu,
  NotebookPen,
  SearchCheck,
  Settings,
  ShieldAlert,
  Users,
} from 'lucide-react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { cn } from '../../lib/utils'
import { useAppStore } from '../../store/app-store'
import { Badge, Button } from '../ui/primitives'
import { Brand } from './brand'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/clients', label: 'Clientes', icon: Users },
  { to: '/policies', label: 'Pólizas', icon: FileText },
  { to: '/payments', label: 'Pagos', icon: CreditCard },
  { to: '/delinquency', label: 'Morosidad', icon: ShieldAlert },
  { to: '/commissions', label: 'Comisiones', icon: BarChart3 },
  { to: '/quotes', label: 'Cotizador', icon: NotebookPen },
  { to: '/uaf-validation', label: 'Validación UAF', icon: SearchCheck },
  { to: '/settings', label: 'Configuración', icon: Settings },
]

export function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const { sidebarCollapsed, toggleSidebar, logout, userName } = useAppStore()

  return (
    <div className="min-h-screen bg-brand-grid px-4 py-4 md:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1680px] gap-4 lg:grid-cols-[auto,1fr]">
        <aside
          className={cn(
            'surface hidden flex-col justify-between transition-all duration-300 lg:flex',
            sidebarCollapsed ? 'w-24 p-4' : 'w-80 p-5',
          )}
        >
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <Brand compact={sidebarCollapsed} />
              <button
                className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-100"
                onClick={toggleSidebar}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>

            <div className="surface-muted p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Modo demo</div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Cartera consolidada y flujos internos del corredor
              </div>
              {!sidebarCollapsed ? (
                <p className="mt-2 text-sm text-slate-500">
                  Experiencia pensada para presentar el CRM final antes de integrar aseguradoras.
                </p>
              ) : null}
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                      isActive
                        ? 'bg-brand-500 text-white shadow-glow'
                        : 'text-slate-600 hover:bg-slate-100',
                      sidebarCollapsed && 'justify-center px-3',
                    )
                  }
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!sidebarCollapsed ? <span>{item.label}</span> : null}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="surface-muted p-4">
            {!sidebarCollapsed ? (
              <>
                <div className="text-sm font-semibold text-slate-900">{userName}</div>
                <div className="mt-1 text-sm text-slate-500">Corredor principal</div>
                <div className="mt-4 flex items-center gap-2">
                  <Badge tone="brand">AseguraZion</Badge>
                  <Badge tone="success">Demo</Badge>
                </div>
                <Button
                  variant="secondary"
                  className="mt-4 w-full"
                  onClick={() => {
                    logout()
                    navigate('/login')
                  }}
                >
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <button
                className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-600"
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
              >
                <Settings className="h-4 w-4" />
              </button>
            )}
          </div>
        </aside>

        <div className="space-y-4">
          <header className="surface p-5">
            <div>
              <div className="text-sm text-slate-500">Vista actual</div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                {titleFromPath(location.pathname)}
              </h1>
            </div>
          </header>

          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

function titleFromPath(pathname: string) {
  if (pathname.startsWith('/clients/')) return 'Detalle de cliente'
  if (pathname.startsWith('/policies/')) return 'Detalle de póliza'

  switch (pathname) {
    case '/dashboard':
      return 'Dashboard ejecutivo'
    case '/clients':
      return 'Clientes'
    case '/policies':
      return 'Pólizas'
    case '/payments':
      return 'Pagos'
    case '/delinquency':
      return 'Morosidad'
    case '/commissions':
      return 'Comisiones'
    case '/quotes':
      return 'Cotizador'
    case '/uaf-validation':
      return 'Validación UAF'
    case '/settings':
      return 'Configuración'
    default:
      return 'AseguraZion'
  }
}
