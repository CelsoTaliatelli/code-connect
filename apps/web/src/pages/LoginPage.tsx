import { AuthBanner } from '../components/organisms/AuthBanner'
import { AuthFormCard } from '../components/organisms/AuthFormCard'
import { AuthLayout } from '../components/templates/AuthLayout'

export function LoginPage() {
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
        />
      }
    />
  )
}
