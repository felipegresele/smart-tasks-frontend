import { create } from "zustand";
import type { AuthResponse } from "../schema";
import { persist } from "zustand/middleware";

interface AuthState {
  user: { name: string; email: string; id: number } | null
  token: string | null
  isAuthenticated: boolean
  login: (data: AuthResponse) => void
  logout: () => void
}
 
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (data) =>
        set({
          user: { name: data.name, email: data.email, id: data.userId },
          token: data.token,
          isAuthenticated: true,
        }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'taskai-auth',
      partialize: (s) => ({ user: s.user, token: s.token, isAuthenticated: s.isAuthenticated }),
    }
  )
)
 