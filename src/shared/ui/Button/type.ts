import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'social'

// кнопка должна содержит текст или хотя бы одну иконку
type ButtonContent =
  | {
      children: ReactNode
      startIcon?: ReactNode
      endIcon?: ReactNode
    }
  | {
      children?: never
      startIcon: ReactNode
      endIcon?: ReactNode
    }
  | {
      children?: never
      startIcon?: ReactNode
      endIcon: ReactNode
    }

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  variant?: ButtonVariant
} & ButtonContent
