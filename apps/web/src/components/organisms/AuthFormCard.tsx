import type { MouseEvent } from 'react'
import { TextField } from '../atoms/TextField'
import { AuthHeader } from '../molecules/AuthHeader'
import { AuthSocialActions } from '../molecules/AuthSocialActions'

type AuthField = {
  label: string
  id: string
  name: string
  type?: 'text' | 'email' | 'password'
  placeholder?: string
}

type AuthFormCardProps = {
  ariaLabel?: string
  title: string
  subtitle: string
  actionLabel: string
  fields: AuthField[]
  showSocialActions?: boolean
  socialActionsPosition?: 'top' | 'bottom'
  showRememberMe?: boolean
  showTerms?: boolean
  footerLink?: {
    label: string
    href: string
  }
  bottomPrompt?: {
    leadingText: string
    linkText: string
    href: string
  }
}

export function AuthFormCard({
  ariaLabel = 'Formulário de autenticação',
  title,
  subtitle,
  actionLabel,
  fields,
  showSocialActions = true,
  socialActionsPosition = 'top',
  showRememberMe = false,
  showTerms = false,
  footerLink,
  bottomPrompt,
}: AuthFormCardProps) {
  const handleRouteClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const href = event.currentTarget.getAttribute('href')

    if (!href?.startsWith('/')) {
      return
    }

    event.preventDefault()
    window.history.pushState({}, '', href)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const socialActions = showSocialActions ? (
    <>
      <div className="divider" aria-hidden="true">
        <span>ou</span>
      </div>
      <AuthSocialActions />
    </>
  ) : null

  return (
    <section className="auth-card" aria-label={ariaLabel}>
      <AuthHeader title={title} subtitle={subtitle} />

      {socialActionsPosition === 'top' ? socialActions : null}

      <form className="auth-form">
        {fields.map((field) => (
          <TextField
            key={field.id}
            label={field.label}
            id={field.id}
            name={field.name}
            type={field.type ?? 'text'}
            placeholder={field.placeholder}
          />
        ))}

        {showRememberMe ? (
          <label className="remember-me remember-me--standalone">
            <input type="checkbox" defaultChecked />
            <span>Lembrar-me</span>
          </label>
        ) : null}

        {showTerms ? (
          <label className="terms-checkbox">
            <input type="checkbox" />
            <span>
              Aceito os <a href="#">termos de uso</a> e a <a href="#">política de privacidade</a>
            </span>
          </label>
        ) : null}

        {footerLink ? (
          <div className="form-row form-row--compact">
            <a href={footerLink.href} onClick={handleRouteClick}>
              {footerLink.label}
            </a>
          </div>
        ) : null}

        <button type="submit" className="primary-button primary-button--register">
          <span>{actionLabel}</span>
          <span aria-hidden="true">→</span>
        </button>
      </form>

      {socialActionsPosition === 'bottom' ? socialActions : null}

      {bottomPrompt ? (
        <p className="auth-footer-prompt">
          {bottomPrompt.leadingText}{' '}
          <a href={bottomPrompt.href} onClick={handleRouteClick}>
            {bottomPrompt.linkText}
          </a>
        </p>
      ) : null}
    </section>
  )
}
