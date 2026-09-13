import { useEffect, useState, type ReactNode } from 'react'
import {
  getCurrentUser,
  loginUser,
  registerUser,
  type LoginCredentials,
  type PublicUser,
  type RegisterCredentials,
} from '../lib/authApi'
import { AuthContext, type AuthContextValue } from './authContext'

const tokenStorageKey = 'code-connect.access-token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null)
  const [isLoading, setIsLoading] = useState(() => Boolean(window.localStorage.getItem(tokenStorageKey)))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = window.localStorage.getItem(tokenStorageKey)

    if (!token) {
      return
    }

    getCurrentUser(token)
      .then(setUser)
      .catch(() => {
        window.localStorage.removeItem(tokenStorageKey)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = async (credentials: LoginCredentials) => {
    setError(null)
    const response = await loginUser(credentials)
    window.localStorage.setItem(tokenStorageKey, response.accessToken)
    setUser(await getCurrentUser(response.accessToken))
  }

  const register = async (credentials: RegisterCredentials) => {
    setError(null)
    await registerUser(credentials)
    await login({
      email: credentials.email,
      password: credentials.password,
    })
  }

  const logout = () => {
    window.localStorage.removeItem(tokenStorageKey)
    setUser(null)
    setError(null)
  }

  const value: AuthContextValue = {
    user,
    isLoading,
    isSubmitting,
    error,
    login: async (credentials) => {
      setIsSubmitting(true)
      try {
        await login(credentials)
      } catch (requestError) {
        const message = requestError instanceof Error ? requestError.message : 'Não foi possível entrar.'
        setError(message)
        throw requestError
      } finally {
        setIsSubmitting(false)
      }
    },
    register: async (credentials) => {
      setIsSubmitting(true)
      try {
        await register(credentials)
      } catch (requestError) {
        const message = requestError instanceof Error ? requestError.message : 'Não foi possível criar a conta.'
        setError(message)
        throw requestError
      } finally {
        setIsSubmitting(false)
      }
    },
    logout,
    clearError: () => setError(null),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
