import type { ReactNode } from 'react'

type AuthLayoutProps = {
  banner: ReactNode
  form: ReactNode
}

export function AuthLayout({ banner, form }: AuthLayoutProps) {
  return (
    <div className="auth-shell">
      <main className="auth-layout">
        {banner}
        {form}
      </main>
    </div>
  )
}
