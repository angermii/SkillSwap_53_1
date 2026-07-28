import type { ChangeEvent, InputHTMLAttributes } from 'react'

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'defaultValue' | 'onChange' | 'className'
>

export interface SearchInputProps extends NativeInputProps {
  value?: string
  defaultValue?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  onClear?: () => void
  className?: string
  wrapperClassName?: string
  inputClassName?: string
  clearButtonLabel?: string
}
