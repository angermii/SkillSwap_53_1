import type { ReactNode } from 'react'

export type ModalSize = 'small' | 'large'

export type ModalUIProps = {
  title: string
  onClose: () => void
  children: ReactNode
  icon?: ReactNode
  size?: ModalSize
  className?: string
}

export type ModalOverlayUIProps = {
  onClick: () => void
}
