type SocialButtonProps = {
  icon: string
  alt: string
  label: string
}

export function SocialButton({ icon, alt, label }: SocialButtonProps) {
  return (
    <button type="button" className="social-button" aria-label={label}>
      <img src={icon} alt={alt} />
      <span>{label}</span>
    </button>
  )
}
