import type { InputHTMLAttributes } from 'react'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  id: string
}

export function TextField({ label, id, type = 'text', ...props }: TextFieldProps) {
  return (
    <div className="field-group">
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} {...props} />
    </div>
  )
}
