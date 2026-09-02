type PrimaryButtonProps = {
  label: string
  type?: 'button' | 'submit'
  onClick?: () => void
}

export function PrimaryButton({ label, type = 'button', onClick }: PrimaryButtonProps) {
  return (
    <button type={type} className="primary-button" onClick={onClick}>
      {label}
    </button>
  )
}
