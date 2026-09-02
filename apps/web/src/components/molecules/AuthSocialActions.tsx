import { SocialButton } from '../atoms/SocialButton'

export function AuthSocialActions() {
  return (
    <div className="social-actions" aria-label="Opções de login social">
      <SocialButton icon="/git.png" alt="Ícone do Git" label="Git" />
      <SocialButton icon="/gmail.png" alt="Ícone do Gmail" label="Gmail" />
    </div>
  )
}
