import { PrimaryButton } from '../atoms/PrimaryButton'
import { TextField } from '../atoms/TextField'
import { AuthHeader } from '../molecules/AuthHeader'
import { AuthSocialActions } from '../molecules/AuthSocialActions'

export function AuthFormCard() {
  return (
    <section className="auth-card" aria-label="Formulário de login">
      <AuthHeader title="Login" subtitle="Entre com sua conta para continuar" />

      <AuthSocialActions />

      <div className="divider" aria-hidden="true">
        <span>ou</span>
      </div>

      <form className="auth-form">
        <TextField label="Email" id="email" name="email" type="email" placeholder="seu@email.com" />
        <TextField label="Senha" id="password" name="password" type="password" placeholder="••••••••" />

        <div className="form-row">
          <label className="remember-me">
            <input type="checkbox" />
            <span>Lembrar senha</span>
          </label>
          <a href="#">Esqueci a senha</a>
        </div>

        <PrimaryButton label="Entrar" type="submit" />
      </form>
    </section>
  )
}
