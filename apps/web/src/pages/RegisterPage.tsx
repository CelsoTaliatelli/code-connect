import { useState } from 'react'
import { AuthBanner } from '../components/organisms/AuthBanner'
import { AuthFormCard } from '../components/organisms/AuthFormCard'
import { AuthLayout } from '../components/templates/AuthLayout'
import { useAuth } from '../hooks/useAuth'

function goTo(path: string) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function RegisterPage() {
  const { register, error, isSubmitting, clearError } = useAuth()
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleSubmit = async (values: Record<string, string>) => {
    clearError()
    setValidationError(null)

    const name = values.name.trim()
    const email = values.email.trim().toLowerCase()
    const password = values.password
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    if (!name || !isValidEmail || password.length < 8) {
      setValidationError('Preencha nome e email válidos. A senha deve ter pelo menos 8 caracteres.')
      return
    }

    try {
      await register({ name, email, password })
      goTo('/')
    } catch {}
  }

  return (
    <AuthLayout
      banner={
        <AuthBanner
          title="Cadastro"
          description="Olá! Preencha seus dados."
        />
      }
      form={
        <AuthFormCard
          ariaLabel="Formulário de cadastro"
          title="Cadastro"
          subtitle="Olá! Preencha seus dados."
          actionLabel="Cadastrar"
          showSocialActions
          socialActionsPosition="bottom"
          showRememberMe
          fields={[
            { label: 'Nome', id: 'name', name: 'name', type: 'text', placeholder: 'Nome completo' },
            { label: 'Email', id: 'email', name: 'email', type: 'email', placeholder: 'Digite seu email' },
            { label: 'Senha', id: 'password', name: 'password', type: 'password', placeholder: '******' },
          ]}
          bottomPrompt={{ leadingText: 'Já tem conta?', linkText: 'Faça seu login!', href: '/login' }}
          error={validationError ?? error}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      }
    />
  )
}
