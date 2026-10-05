import type { HTMLAttributes, ReactElement, ReactNode } from 'react'

export type DropdownAlign = 'start' | 'end'

export type DropdownProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  trigger: ReactElement
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  align?: DropdownAlign
  contentClassName?: string
}
