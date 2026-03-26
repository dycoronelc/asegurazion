import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { AppShell } from './components/layout/app-shell'
import { useAppStore } from './store/app-store'
import { ClientDetailPage } from './pages/client-detail-page'
import { ClientsPage } from './pages/clients-page'
import { CommissionsPage } from './pages/commissions-page'
import { DashboardPage } from './pages/dashboard-page'
import { DelinquencyPage } from './pages/delinquency-page'
import { LoginPage } from './pages/login-page'
import { PaymentsPage } from './pages/payments-page'
import { PoliciesPage } from './pages/policies-page'
import { PolicyDetailPage } from './pages/policy-detail-page'
import { QuotePage } from './pages/quote-page'
import { SettingsPage } from './pages/settings-page'
import { UafValidationPage } from './pages/uaf-validation-page'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

function AppRoutes() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />

      <Route
        element={isAuthenticated ? <AppShell /> : <Navigate to="/login" replace />}
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/clients/:clientId" element={<ClientDetailPage />} />
        <Route path="/policies" element={<PoliciesPage />} />
        <Route path="/policies/:policyId" element={<PolicyDetailPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/delinquency" element={<DelinquencyPage />} />
        <Route path="/commissions" element={<CommissionsPage />} />
        <Route path="/quotes" element={<QuotePage />} />
        <Route path="/uaf-validation" element={<UafValidationPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}
