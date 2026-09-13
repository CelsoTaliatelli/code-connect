import { createContext } from 'react'
import type { LoginCredentials, PublicUser, RegisterCredentials } from '../lib/authApi'

export type AuthContextValue = {
  user: PublicUser | null
  isLoading: boolean
  isSubmitting: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => void
  clearError: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
