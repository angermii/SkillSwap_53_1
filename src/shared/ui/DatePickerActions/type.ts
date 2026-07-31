import type { HTMLAttributes } from 'react'

export type DatePickerActionsProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
  confirmDisabled?: boolean
}
