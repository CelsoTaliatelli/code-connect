import { AuthBanner } from '../components/organisms/AuthBanner'
import { AuthFormCard } from '../components/organisms/AuthFormCard'
import { AuthLayout } from '../components/templates/AuthLayout'

export function RegisterPage() {
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
            { label: 'Nome', id: 'fullName', name: 'fullName', type: 'text', placeholder: 'Nome completo' },
            { label: 'Email', id: 'email', name: 'email', type: 'email', placeholder: 'Digite seu email' },
            { label: 'Senha', id: 'password', name: 'password', type: 'password', placeholder: '******' },
          ]}
          bottomPrompt={{ leadingText: 'Já tem conta?', linkText: 'Faça seu login!', href: '/login' }}
        />
      }
    />
  )
}
