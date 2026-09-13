import { AuthBanner } from '../components/organisms/AuthBanner'
import { AuthFormCard } from '../components/organisms/AuthFormCard'
import { AuthLayout } from '../components/templates/AuthLayout'
import { useAuth } from '../hooks/useAuth'

function goTo(path: string) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function LoginPage() {
  const { login, error, isSubmitting } = useAuth()

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      await login({ email: values.email, password: values.password })
      goTo('/')
    } catch {}
  }

  return (
    <AuthLayout
      banner={
        <AuthBanner
          title="Conecte-se ao seu futuro"
          description="Acesse sua comunidade, acompanhe projetos e avance com confiança."
        />
      }
      form={
        <AuthFormCard
          title="Login"
          subtitle="Entre com sua conta para continuar"
          actionLabel="Entrar"
          showSocialActions
          showRememberMe
          footerLink={{ label: 'Esqueci a senha', href: '#' }}
          fields={[
            { label: 'Email', id: 'email', name: 'email', type: 'email', placeholder: 'seu@email.com' },
            { label: 'Senha', id: 'password', name: 'password', type: 'password', placeholder: '••••••••' },
          ]}
          bottomPrompt={{ leadingText: 'Ainda não tem conta?', linkText: 'Cadastre-se!', href: '/cadastro' }}
          error={error}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      }
    />
  )
}
