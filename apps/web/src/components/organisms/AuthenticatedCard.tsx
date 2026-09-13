import { useAuth } from '../../hooks/useAuth'

export function AuthenticatedCard() {
  const { user, logout } = useAuth()

  return (
    <section className="auth-card authenticated-card" aria-label="Área autenticada">
      <p className="eyebrow">Code Connect</p>
      <h1>Olá, {user?.name}</h1>
      <p className="subtitle">Você está conectado como {user?.email}.</p>
      <button type="button" className="primary-button primary-button--register" onClick={logout}>
        <span>Sair</span>
        <span aria-hidden="true">→</span>
      </button>
    </section>
  )
}
