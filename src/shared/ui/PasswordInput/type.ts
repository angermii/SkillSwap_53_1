import type { ChangeEvent, InputHTMLAttributes } from 'react'

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'defaultValue' | 'onChange' | 'className' | 'disabled' | `readOnly`
>

export interface PasswordInputProps extends NativeInputProps {
  value?: string
  defaultValue?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  label?: string
  error?: string
  hint?: string
  className?: string
  wrapperClassName?: string
  inputClassName?: string
  isVisible?: boolean
  onVisibilityChange?: (isVisible: boolean) => void
  showLabel?: string
  hideLabel?: string
  invalid?: boolean
}
