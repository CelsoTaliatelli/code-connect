import { AuthenticatedCard } from '../components/organisms/AuthenticatedCard'
import { AuthLayout } from '../components/templates/AuthLayout'

export function HomePage() {
  return (
    <AuthLayout
      banner={
        <div className="auth-banner" aria-hidden="true">
          <div className="brand-lockup">
            <span className="brand-mark"><span className="brand-mark__dot" /></span>
            <span className="brand-text"><span>code</span><span>connect</span></span>
          </div>
        </div>
      }
      form={<AuthenticatedCard />}
    />
  )
}
