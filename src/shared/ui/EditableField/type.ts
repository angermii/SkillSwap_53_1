interface BaseEditableFieldProps {
  label?: string
  value?: string
  defaultValue?: string
  disabled?: boolean
  isEditing?: boolean
  onEditingChange?: (isEditing: boolean) => void
  onChange?: (value: string) => void
  onSave?: (value: string) => void
  onCancel?: () => void
  className?: string
  wrapperClassName?: string
  inputClassName?: string
  editLabel?: string
  saveLabel?: string
  cancelLabel?: string
}

type EditableFieldLineProps = BaseEditableFieldProps & {
  multiline?: false
  rows?: never
}

type EditableFieldMultilineProps = BaseEditableFieldProps & {
  multiline: true
  rows: number
}

export type EditableFieldProps = EditableFieldLineProps | EditableFieldMultilineProps