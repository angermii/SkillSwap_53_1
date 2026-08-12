import { InputHTMLAttributes, TextareaHTMLAttributes, ReactElement } from 'react'

interface BaseInputProps {
  label?: string
  error?: string
  leftIcon?: ReactElement
  rightIcon?: ReactElement
  className?: string
  wrapperClassName?: string
  inputClassName?: string
  invalid?: boolean
}

type InputLineProps = BaseInputProps & {
  multiline?: false
} & Omit<InputHTMLAttributes<HTMLInputElement>, keyof BaseInputProps>

type MultiLineInputProps = BaseInputProps & {
  multiline: true
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, keyof BaseInputProps>

export type InputProps = InputLineProps | MultiLineInputProps

export type InputRef = HTMLInputElement | HTMLTextAreaElement
