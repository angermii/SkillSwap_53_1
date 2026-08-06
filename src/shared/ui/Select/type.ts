import { HTMLAttributes } from 'react'

export type option = {
  name?: string
  value?: string
}
export interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  label?: string
  placeholder?: string
  iconSrc?: string
  options?: option[]
  value?: string
  onChange?: (value: string) => void
}
