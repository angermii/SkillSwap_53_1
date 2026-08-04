import type { HTMLAttributes } from 'react'

export type DatePickerProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue' | 'children'
> & {
  value?: Date
  onChange: (date: Date | undefined) => void
  label?: string
  placeholder?: string
  name?: string
  fromYear?: number
  toYear?: number
  confirmText?: string
  cancelText?: string
  inputClassName?: string
  dropdownClassName?: string
  birthDate?: Date
}