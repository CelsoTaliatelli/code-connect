type AuthBannerProps = {
  title: string
  description: string
  imageSrc?: string
}

export function AuthBanner({ title, description, imageSrc }: AuthBannerProps) {
  return (
    <aside className="auth-banner" aria-label="Banner de apresentação">
      <img src={imageSrc ?? '/Banner do Login.png'} alt="Banner de login" />

      <div className="banner-overlay">
        <span className="banner-badge">Welcome</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div className="brand-lockup" aria-label="Code Connect brand">
        <div className="brand-mark" aria-hidden="true">
          <span className="brand-mark__dot" />
        </div>
        <div className="brand-text">
          <span>code</span>
          <span>connect</span>
        </div>
      </div>
    </aside>
  )
}
