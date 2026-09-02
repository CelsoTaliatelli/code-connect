type AuthHeaderProps = {
  title: string
  subtitle: string
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <header className="auth-header">
      <p className="eyebrow">Acesso rápido</p>
      <h1>{title}</h1>
      <p className="subtitle">{subtitle}</p>
    </header>
  )
}
