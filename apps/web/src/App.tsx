import './App.css'
import { useEffect, useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { FeedPage } from './pages/FeedPage'
import { PostDetailsPage } from './pages/PostDetailsPage'

function getAuthRoute() {
  if (window.location.pathname === '/login') return 'login'
  if (window.location.pathname === '/cadastro') return 'register'
  if (window.location.pathname.startsWith('/posts/')) return 'post'
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

    if (user && (authRoute === 'login' || authRoute === 'register')) {
      window.history.replaceState({}, '', '/')
    }
  }, [authRoute, isLoading, user])

  if (isLoading) {
    return <p role="status">Carregando...</p>
  }

  if (authRoute === 'post') return <PostDetailsPage />
  if (authRoute === 'home') return <FeedPage />
  if (user) return <HomePage />
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
