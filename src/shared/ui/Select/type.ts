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
  onChange?: (value: string) => void
}
