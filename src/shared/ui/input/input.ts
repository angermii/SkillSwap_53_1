import { InputHTMLAttributes, ReactElement } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: ReactElement
  rightIcon?: ReactElement
}
