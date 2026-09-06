import './App.css'
import { useEffect, useState } from 'react'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'

function getAuthRoute() {
  return window.location.pathname === '/login' ? 'login' : 'register'
}

function App() {
  const [authRoute, setAuthRoute] = useState(getAuthRoute)

  useEffect(() => {
    const handlePopState = () => setAuthRoute(getAuthRoute())

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return authRoute === 'login' ? <LoginPage /> : <RegisterPage />
}

export default App
