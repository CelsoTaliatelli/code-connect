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
      form={<AuthFormCard />}
    />
  )
}
