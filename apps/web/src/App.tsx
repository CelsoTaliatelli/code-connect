import './App.css'
import { useEffect, useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'

function getAuthRoute() {
  if (window.location.pathname === '/login') return 'login'
  if (window.location.pathname === '/cadastro') return 'register'
  return 'home'
}

function AppContent() {
  const [authRoute, setAuthRoute] = useState(getAuthRoute)
  const { user, isLoading } = useAuth()

  useEffect(() => {
    const handlePopState = () => setAuthRoute(getAuthRoute())

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (isLoading) return

    if (user && authRoute !== 'home') {
      window.history.replaceState({}, '', '/')
    } else if (!user && authRoute === 'home') {
      window.history.replaceState({}, '', '/login')
    }
  }, [authRoute, isLoading, user])

  if (isLoading) {
    return <p role="status">Carregando...</p>
  }

  if (user || authRoute === 'home') return user ? <HomePage /> : <LoginPage />
  return authRoute === 'login' ? <LoginPage /> : <RegisterPage />
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
