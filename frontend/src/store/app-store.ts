import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AppState = {
  isAuthenticated: boolean
  sidebarCollapsed: boolean
  userName: string
  login: () => void
  logout: () => void
  toggleSidebar: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      sidebarCollapsed: false,
      userName: 'Corredor Principal',
      login: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    }),
    {
      name: 'asegurazion-demo-store',
    },
  ),
)
