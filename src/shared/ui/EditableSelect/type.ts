import type { option } from '../Select'

export interface EditableSelectProps {
  label?: string
  value?: string
  defaultValue?: string
  options?: option[]
  placeholder?: string
  editable?: boolean
  isEditing?: boolean
  onEditingChange?: (isEditing: boolean) => void
  onChange?: (value: string) => void
  className?: string
  editLabel?: string
}
