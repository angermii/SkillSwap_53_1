export type option = {
  name?: string
  value?: string
}
export interface SelectProps {
  label?: string
  placeholder?: string
  iconSrc?: string
  options?: option[]
  onChange?: (value: string) => void
}
